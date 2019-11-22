import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
    AuthorityListFilter, AuthorityRequest, AuthorityRequestUpdate, CategoryRequest,
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
import {showErrorPopup} from "../../../shared/utils";
import {CategoryGroupsInDetailResponse} from "../../competitor/models/competitor-by-category";
import {CompetitorService} from "../../competitor/services/competitor-service";
import {TranslateService} from "@ngx-translate/core";
import * as FileSaver from 'file-saver';
import {Observable} from "rxjs/Observable";

const CURRENT_URL = '/admin/authority-update';

@Component({
    templateUrl: './authority-update.component.html',
    styleUrls: ['./authority-update.component.css']
})
export class AuthorityUpdateComponent implements OnInit {
    tailMail: string = "@tmon.co.kr" ;
    authorityRequests: AuthorityRequest[];
    pageAuthRequests: PageAuthRequest[];
    pagination: Pagination = new Pagination(new PageRequest);
    checkAll: boolean = false;
    authorities = [];

    statuses: any = [
        { id: 'Y', name: '활성화' },
        { id: 'N', name: '비활성화' },
        { id: 'O', name: '퇴사' }
    ];

    authorityRequestFilter: AuthorityListFilter = new AuthorityListFilter();
    navSubscription: Subscription;
    constructor(
        private authorityApprovalService: AuthorityService,
        private blockUI: BlockUIService,
        private dialogService: DialogService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private route: ActivatedRoute,
        private translateService: TranslateService,
        private competitorService: CompetitorService
    ) {
        this.blockUI.vRef = this.viewContainerRef;


    }

    ngOnInit() {
        this.onLoadDepartments();
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let contextRoot = event["url"];
            let params = RouteUtils.extractParams(this.route, {});
            this.authorityRequestFilter = new AuthorityListFilter();
            if (contextRoot != CURRENT_URL) {
                this.authorityRequestFilter.bind(params);
                this.pagination.pageRequest.reset();
            }
            this.onLoadAuthorityUpdate(true);
        });

    }

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    onLoadDepartments(): void {
        this.blockUI.start();
        this.competitorService.loadDepartmentsInDetail().subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                }
                case 'OK': {
                    let departmentsInDetails = serverResponse as CategoryGroupsInDetailResponse;
                    departmentsInDetails.data.forEach(gr => {
                        let dep  = gr.childs.find(c=> c.cateNo == gr.cateNo);
                        if(dep != undefined || dep != null) {
                            this.authorities.push({name: dep.name, id: dep.cateNo});
                        }
                    });
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error to load departments', error);
            this.blockUI.stop();
            let errorMessage = this.translateService.instant("message.err_unknown");
            showErrorPopup(this.dialogService, this.translateService, errorMessage);
        });
    }

    onLoadAuthorityUpdate(flg: boolean) {
        this.blockUI.start();
        this.authorityApprovalService.getAuthorityList(this.authorityRequestFilter, this.pagination.pageRequest).subscribe(serverResponse => {
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
                    if(flg) {
                        for (let i = 0; i < this.authorityRequests.length; i++) {
                            this.authorityRequests[i].isChecked = flg;
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

    onClickDeleteCheckbox(event, item: AuthorityRequest): void {
        if(event.target.checked){
            item.status = "X";
        }else
            item.status = "Y";
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) {
            this.pagination.pageRequest.page = event.page - 1;
            // RouteUtils.navigateTo(this.router, CURRENT_URL, this.authorityRequestFilter.unbind(), true);
            this.onLoadAuthorityUpdate(false);
        }
    }

    showErrorPopup(message: string){
        this.dialogService.addDialog(AlertComponent, {
            title:'Exception',
            message: message,

        }).subscribe(()=>{});
    }

    onBtnClickExport(): void {
        this.authorityApprovalService.exportToExcel(this.authorityRequestFilter);
    }

    handleCheckAll(event) {
        for (let i = 0; i < this.authorityRequests.length; i++) {
            this.authorityRequests[i].isChecked = event.target.checked;
        }
    }

    handleDisableUser(event, item: AuthorityRequest) {
        item.status = event.target.value ;
    }

    handleCheck(event, authorityRequest: AuthorityRequest) {
        authorityRequest.isChecked = event.target.checked;
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

    onBtnClickEmailExport() {
        this.blockUI.start();

        this.authorityApprovalService.getActiveUsers().subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                }
                case 'OK': {
                    let response = serverResponse;
                    let items = response.data as AuthorityRequest[];
                    let dataFile: string="";
                    for (let i = 0 ; i < items.length; i++) {
                        dataFile = dataFile + items[i].userId + this.tailMail + '; ';
                    }
                    if (dataFile.length > 0) {
                        var blob = new Blob([dataFile], {type: "text/plain;charset=utf-8"});
                        FileSaver.saveAs(blob, "Email Address.txt");
                    }
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error to load active users', error);
            this.blockUI.stop();
            let errorMessage = this.translateService.instant("message.err_unknown");
            showErrorPopup(this.dialogService, this.translateService, errorMessage);
        });
    }

    onSave() {
        this.blockUI.start();
        let requests: AuthorityRequestUpdate[] = new Array();
        let username = window.localStorage.getItem('username');
        for (let i = 0 ; i < this.authorityRequests.length; i++) {
            if (this.authorityRequests[i].isChecked) {
                let item: AuthorityRequest = this.authorityRequests[i];
                let update: AuthorityRequestUpdate = new AuthorityRequestUpdate(
                    item.srl, item.userId, item.userName, item.categoryVersion, item.authorityRequests,
                    item.categoryAuthorities, item.pageAuthRequests, item.pageIds, item.status, item.pageAuthority, item.department, item.adminMemo);
                update.appliedToSystem = item.appliedToSystem;
                update.updater = username;
                requests.push(update);
            }
        }
        if (requests.length == 0) {
            this.blockUI.stop();
            return;
        }

        this.authorityApprovalService.updateAuthorityRequests(requests).subscribe( serverResponse => {
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

    onSearch() {
        this.blockUI.start();
        this.pagination.pageRequest.page = this.pagination.pageRequest.page - 1;
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.authorityRequestFilter.unbind(), true);
    }

    handleSystemChange(item): void {

    }
}
