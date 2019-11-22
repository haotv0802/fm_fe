import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DialogService} from "ng2-bootstrap-modal";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";
import {IMyDateModel} from "mydatepicker";
import {GrossReport, GrossReportFilter} from "app/modules/gross-report/model/grossReport";
import {Pagination} from "../../shared/models/pagination";
import {PageRequest} from "../../shared/models/page-request";
import {GrossReportService} from "./sevice/gross-report.service";
import {BlockUIService} from "../../shared/services/block-ui.service";
import RouteUtils from "../../shared/utils/RouteUtils";
import {BadRequestResponse} from "../../shared/models/bad-request-response";
import {AlertComponent} from "../../common/alert/alert.component";
import {get, showErrorPopup} from "../../shared/utils";
import {CategoryGroupsInDetailResponse} from "../competitor/models/competitor-by-category";
import {CompetitorService} from "../competitor/services/competitor-service";
import {TranslateService} from "@ngx-translate/core";
import {NotificationDialogComponent} from "../admin/notification/dialog/notification-dialog.component";
import {NotificationService} from "../admin/notification/service/notification-service";
import {CookieService} from "ngx-cookie";
import {Notification} from "../admin/notification/models/Notification";
import {AuthGuard} from "../../shared/services/auth.service";

const CURRENT_URL = '/gross-report';
const PAGE_ID = "GROSS_REPORT";

@Component({
    templateUrl: 'gross-report.component.html',
    styleUrls: ['gross-report.component.css']
})
export class GrossReportComponent implements OnInit {
    grossReportList: GrossReport[];
    pagination: Pagination = new Pagination(new PageRequest);

    grossReportFilter: GrossReportFilter = new GrossReportFilter();
    navSubscription: Subscription;
    constructor(
        private grossReportService: GrossReportService,
        private notificationService: NotificationService,
        private blockUI: BlockUIService,
        private dialogService: DialogService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private route: ActivatedRoute,
        private competitorService: CompetitorService,
        private translateService: TranslateService,
        private authGuard: AuthGuard,
        private cookieService: CookieService
    ) {
        this.blockUI.vRef = this.viewContainerRef;
        this.blockUI.start();
        this.authGuard.recordUserClick(PAGE_ID).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error to registry activities', error);
            this.blockUI.stop();
        });

    }

    companies = [{coId: 'tmn', name: 'TMN'}, {coId: 'wmp', name: 'WMP'}];

    currency: string = '원';
    role: string;
    assignedCategoriesInRole: string[] = [];
    departmentMap = {};
    departments = [];
    categoryMapNoAndName = {};
    teams = [];

    ngOnInit() {
        this.notificationService.getNotificationByPageId(PAGE_ID).subscribe(data => {

            let notifications: Notification[] = [];
            let isShown: string;
            for (let i = 0; i < data.length; i++) {
                let notification: Notification = data[i] as Notification;
                isShown = this.cookieService.get(notification.srl);
                if (!isShown || isShown === "true") {
                    notifications.push(notification);
                }
            }

            if (notifications && notifications.length) {
                for (let i = 0; i < notifications.length; i++) {
                    let params = {
                        model: notifications[i]
                    };
                    this.dialogService.addDialog(NotificationDialogComponent, params).subscribe(model => {
                        if (model) {
                            this.blockUI.start();
                        }
                    });
                }
            }
        }, error => {
            this.translateService.get('message.err_loading_notification').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });

        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let contextRoot = event["url"];
            let params = RouteUtils.extractParams(this.route, {});
            this.grossReportFilter = new GrossReportFilter();
            if (contextRoot != CURRENT_URL) {
                this.grossReportFilter.bind(params);
                this.pagination.pageRequest.reset();
            }
            this.onLoadDepartments();
            this.onLoadGrossReport();
        });
    }


    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    handleStartDateChange(event: IMyDateModel) {
        this.grossReportFilter.startDate = event;
    }

    handleEndDateChange(event: IMyDateModel) {
        this.grossReportFilter.endDate = event;
    }

    onLoadGrossReport() {
        this.grossReportList = [];
        this.blockUI.start();
        this.grossReportService.getGrossReport(this.grossReportFilter, this.pagination.pageRequest).subscribe(serverResponse => {
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
                    this.grossReportList = response.data as GrossReport[];
                    this.pagination.totalItems = response.pagination.total;
                    this.blockUI.stop();
                    break;
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            this.blockUI.stop();
        });
    }

    onPaginationChanged(event: any): void {
        this.grossReportList = [];
        if (!this.blockUI.isLoading()) {
            this.pagination.pageRequest.page = event.page - 1;
            // RouteUtils.navigateTo(this.router, CURRENT_URL, this.authorityRequestFilter.unbind(), true);
            this.onLoadGrossReport();
        }
    }

    showErrorPopup(message: string){
        this.dialogService.addDialog(AlertComponent, {
            title:'Exception',
            message: message,

        }).subscribe(()=>{});
    }

    onSearch() {
        this.pagination.pageRequest.page = this.pagination.pageRequest.page - 1;
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.grossReportFilter.unbind(), true);
    }

    onExportExcel() : void {
        this.grossReportService.exportReportToExcel(this.grossReportFilter);
    }

    sortKeys: any = {
        msCat1Title: 'cat1_title',
        msCat2Title: 'cat2_title',
        orgCat1: 'org_cat1',
        orgCat2: 'org_cat2',
        sumSales: 'sales',
        coId: 'co_id',
        saleDate: 'saledate'

    };


    tableSetting = {
        table: {
            translate: true,
            id: 'detailtbl'
        },
        column: {
            saleDate: {
                title: 'grossReport.sale_date',
                align: 'center',
                sortable: true,
            },
            coId: {
                title: 'grossReport.co_name',
                sortable: true,
            },
            msCat1Title: {
                title: 'grossReport.snoopy_category_1',
                sortable: true,
            },
            msCat2Title: {
                title: 'grossReport.snoopy_category_2',
                sortable: true,
            },
            orgCat1: {
                title: 'grossReport.competitor_category',
                sortable: true,
                render: (data: { value: any, item: object }, settings: object) => {
                    var level1 = (data.item['orgCat1'] != undefined && data.item['orgCat1'] != '' ) ? data.item['orgCat1'] : '';
                    var level2 = (data.item['orgCat2'] != undefined && data.item['orgCat2'] != '' ) ? data.item['orgCat2'] : '';
                    var level3 = (data.item['orgCat3'] != undefined && data.item['orgCat3'] != '' ) ? data.item['orgCat3'] : '';
                    var level4 = (data.item['orgCat4'] != undefined && data.item['orgCat4'] != '' ) ? data.item['orgCat4'] : '';

                    var separate1 = '';
                    var separate2 = '';
                    var separate3 = '';

                    if(level2 != '')
                        separate1 = ' > ';
                    if(level3 != '')
                        separate2 = ' > ';
                    if(level4 != '')
                        separate3 = ' > ';
                    return (level1 + separate1 + level2 + separate2 + level3 + separate3 + level4);
                }
            },
            sumSales: {
                title: 'grossReport.gr',
                sortable: true,
                type: 'number',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.item['sumSales'].toLocaleString() + this.currency;
                }
            }

        }
    };

    handleTableChange({ action, data, event }) {
        if (action === 'sort') {
            let col = get(this.sortKeys, data.column, data.column);
            this.grossReportFilter.sort = (col+","+data.type);
        }
        this.onSearch();
    }

    filterDepartmentWithRoles() : void {
        let assignedCategories = window.localStorage.getItem("assignedCategories");
        this.role = window.localStorage.getItem("role");
        if(assignedCategories != null && assignedCategories != '' && this.role !== 'admin' && !this.categoryMapNoAndName) {
            this.assignedCategoriesInRole = assignedCategories.split(";");
            this.departments = [];
            this.assignedCategoriesInRole.forEach(e => {
                this.departments.push({name: this.categoryMapNoAndName[e], id: e});
                if(this.departments.length === 1) {
                    this.grossReportFilter.departmentId = this.assignedCategoriesInRole[0];
                }
            });
            this.grossReportFilter.departmentId = this.assignedCategoriesInRole[0];
            this.loadTeamsByDepartment(true);
        }
    }
    handleDepartmentChanged(event) {
        let department = event.target.value;
        this.grossReportFilter.departmentId = department;
        this.loadTeamsByDepartment(true);
    }

    loadTeamsByDepartment(reset = false) {
        let department = this.grossReportFilter.departmentId;
        let teams = [];
        if (department !== '') {
            teams = this.departmentMap[department];
        }
        this.teams = teams;
        if (reset) {
            this.grossReportFilter.teamId = '';
        }
    }
    onLoadDepartments(): void {
        if(this.departments.length == 0) {
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
                            let dep = gr.childs.find(c => c.cateNo == gr.cateNo);
                            if (dep != undefined || dep != null) {
                                this.departments.push({name: dep.name, id: dep.cateNo});
                                this.categoryMapNoAndName[dep.cateNo] = dep.name;
                            }
                            this.departmentMap[gr.cateNo] = gr.childs.filter(
                                c => c.cateNo != gr.cateNo
                            ).map(ct => {
                                let t = {name: ct.name, id: ct.cateNo};
                                this.categoryMapNoAndName[ct.cateNo] = ct.name;
                                return t
                            });
                        });

                        if (this.grossReportFilter.departmentId !== '') {
                            this.teams = this.departmentMap[this.grossReportFilter.departmentId];
                        }

                        this.filterDepartmentWithRoles();
                    }
                }
                //this.blockUI.stop();
            }, error => {
                console.log('error to load departments', error);
                this.blockUI.stop();
                let errorMessage = this.translateService.instant("message.err_unknown");
                showErrorPopup(this.dialogService, this.translateService, errorMessage);
            });
        }
    }


}
