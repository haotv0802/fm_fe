import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
    AuthorityRequest, AuthorityRequestFilter, AuthorityRequestUpdate, CategoryRequest,
    PageAuthRequest
} from "../models/authority";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import {AuthorityService} from "../services/authority.service";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {AlertComponent} from "../../../common/alert/alert.component";
import {DialogService} from "ng2-bootstrap-modal";
import {PageRequest} from "../../../shared/models/page-request";
import {Pagination} from "../../../shared/models/pagination";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";

const CURRENT_URL = '/admin/authority-approval';

@Component({
    templateUrl: './authority-approval.component.html',
    styleUrls: ['./authority-approval.component.css']
})
export class AuthorityApprovalComponent implements OnInit {
    authorityRequests: AuthorityRequest[];
    pageAuthRequest: PageAuthRequest[]
    pagination: Pagination = new Pagination(new PageRequest);
    checkAll: boolean = false;

    authorityRequestFilter: AuthorityRequestFilter = new AuthorityRequestFilter();
    navSubscription: Subscription;
    constructor(
        private authorityApprovalService: AuthorityService,
        private blockUI: BlockUIService,
        private dialogService: DialogService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.blockUI.vRef = this.viewContainerRef;
    }

    ngOnInit() {
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let contextRoot = event["url"];
            let params = RouteUtils.extractParams(this.route, {});
            if (contextRoot != CURRENT_URL) {
                this.authorityRequestFilter = new AuthorityRequestFilter();
                this.authorityRequestFilter.bind(params);
                this.pagination.pageRequest.reset();
            }
            this.onLoadAuthorityRequests(true);

        });
    }

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    onLoadAuthorityRequests(flg : boolean) {
        this.blockUI.start();
        this.authorityApprovalService.getAuthorityRequests(this.authorityRequestFilter, this.pagination.pageRequest).subscribe(serverResponse => {
            switch(serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let response = serverResponse;
                    this.authorityRequests = response.data as AuthorityRequest[];
                    this.pagination.totalItems = response.pagination.total;
                    this.checkAll = flg;

                    for (let i = 0; i < this.authorityRequests.length; i++) {
                        this.authorityRequests[i].isChecked = flg;
                        if(this.authorityRequests[i].returned == 'Y'){
                            this.authorityRequests[i].isReturnedCheck = true;
                        }

                        if(this.authorityRequests[i].status == "C"){
                            let requestedCategories = this.authorityRequests[i]["requestedCategories"];
                            let tmp: string[] = requestedCategories.split(";");
                            this.authorityRequests[i].authorityRequests.forEach(e=>{
                                if(tmp.includes(e.no.toString()))
                                    e.checked = true;
                                else
                                    e.checked = false;
                            });

                        }
                    }

                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            this.blockUI.stop();
        });
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pagination.pageRequest.page = event.page - 1;
            this.blockUI.start();
            this.onLoadAuthorityRequests(false);
        }
    }
    showErrorPopup(message: string){
        this.dialogService.addDialog(AlertComponent, {
            title:'Exception',
            message: message,

        }).subscribe(()=>{});
    }

    handleCategoryCheck(event, categoryRequest: CategoryRequest) {
        console.log(categoryRequest);
        categoryRequest.checked = event.target.checked;
    }

    handlePageAuthCheck(event, pageAuthRequest: PageAuthRequest) {
        console.log(pageAuthRequest);
        pageAuthRequest.checked = event.target.checked;
    }

    handlePageAuthorityChange(event, authorityRequest: AuthorityRequest) {
        authorityRequest.pageAuthority = event.target.value;
    }

    handleCheckAll(event) {
        for (let i = 0; i < this.authorityRequests.length; i++) {
            this.authorityRequests[i].isChecked = event.target.checked;
        }
    }

    handleCheck(event, authorityRequest: AuthorityRequest) {
        authorityRequest.isChecked = event.target.checked;
    }

    onSave() {
        this.blockUI.start();
        //let requests: number[] = new Array();
        let requests: AuthorityRequestUpdate[] = new Array();
        for (let i = 0 ; i < this.authorityRequests.length; i++) {
            if (this.authorityRequests[i].isChecked) {
                let item: AuthorityRequest = this.authorityRequests[i];
                let update: AuthorityRequestUpdate = new AuthorityRequestUpdate(
                    item.srl, item.userId, item.userName, item.categoryVersion, item.authorityRequests,
                    item.categoryAuthorities,item.pageAuthRequests, item.pageIds, item.status, item.pageAuthority, item.department,item.adminMemo, item.userMemo,
                    item.isReturnedCheck == true ? 'Y' : 'N'
                );
                update.appliedToSystem = item.appliedToSystem;
                requests.push(update);
                //requests.push(this.authorityRequests[i].srl);
            }
        }
        if (requests.length == 0) {
            this.blockUI.stop();
            return;
        }
        this.authorityApprovalService.approvePartRequests(requests).subscribe( serverResponse => {
            switch(serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    this.pagination.pageRequest.page = this.pagination.pageRequest.page - 1;
                    RouteUtils.navigateTo(this.router, CURRENT_URL, this.authorityRequestFilter.unbind(), true);
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            this.blockUI.stop();
        });
    }

    handleSystemChange(item): void {

    }

}
