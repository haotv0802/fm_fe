import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogService} from "ng2-bootstrap-modal";
import {Subscription} from "rxjs/Subscription";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {Pagination} from "../../../shared/models/pagination";
import {PageRequest} from "../../../shared/models/page-request";
import {formatNumber, showErrorPopup} from "../../../shared/utils";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import {AppSettings} from "../../../shared/models/app-settings";
import {Observable, Observer} from "rxjs";
import {AuditActionService} from "./service/monitor-user-activities-service";
import {AuditActionFilter} from "./models/audit-action-model";
import {AuditActionDto, AuditActionServerResponse} from "./models/audit-action-dto";
import {MenuActionDto,MenuActivitiesPerRow,MenuActionServerResponse} from "./models/menu-action-dto";

const PAGE_ID = "DETAILED_MENU_MONITOR";

@Component({
    selector: 'app-monitor-user-activities',
    templateUrl: './detailed-menu-monitor.component.html',
    styleUrls: ['./detailed-menu-monitor.component.css']
})

export class DetailedMenuMonitorComponent implements OnInit {
    pagination: Pagination = new Pagination(new PageRequest());

    constructor(private auditActionService: AuditActionService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService) {

        this.pagination.pageRequest.reset();
        this.blockUI.vRef = this.viewContainerRef;
    }

    filter: AuditActionFilter = new AuditActionFilter();
    auditActionDto: AuditActionDto = new AuditActionDto();
    auditActionBindedData: MenuActivitiesPerRow[] = [];
    auditActionPagging: MenuActivitiesPerRow[] = [];
    navSubscription: Subscription;
    queryParamsSubscription: Subscription;
    disableSearch: boolean = false;
    sellers = [
        { coId: 'button_count', name: '서비스별 클릭수' , settingsForShow: [
            {"fieldName":"totalButton", "width": "120px", "align": "right", "type": "string"},
            {"fieldName":"searchButton", "width": "120px", "align": "right", "type": "string"},
            {"fieldName": "excelDownloadButton", "width": "120px", "align": "right", "type": "string"},
            {"fieldName": "etc", "width": "120px", "align": "right", "type": "string"}]}
    ];

    lineNo: number = 0;
    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
        if(this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe()
        }
    }

    activityDataSettings: object = {
        table: {
            translate: true,
            tableScroll: true,
            tableScrollHeight: '500px',
            width: '2000px',
            usedColSpanTable: true
        }
    };

    isAdminView:boolean= false;

    onPaginationChanged(event: any): void {
        //if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
        let pageNumReq: number = event.page - 1;
        this.pagination.pageRequest.page = pageNumReq;
        this.lineNo = (event.page -1)* event.itemsPerPage;
        this.auditActionPagging = this.auditActionBindedData.slice(this.pagination.pageRequest.page*this.pagination.maxSize, this.pagination.pageRequest.page*this.pagination.maxSize + this.pagination.maxSize)
        //}
    }

    resetData() {
        this.auditActionBindedData = [];
        this.pagination = new Pagination(new PageRequest());
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
    }

    ngOnInit() {
        this.queryParamsSubscription = this.route.queryParams.subscribe(params=> {
            let role = window.localStorage.getItem("role");
            this.isAdminView = (params['isAdminView']==='true') && role ==='admin';
        });
        this.filter.typeSearch = PAGE_ID;
        let params = RouteUtils.extractParams(this.route, {});
        this.filter.bind(params);
        this.loadData();
        this.buildTableHeader();
    }
    loadData() {
        this.blockUI.start();
        this.auditActionService.loadData(this.filter, this.pagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
                case 'OK': {
                    let response = serverResponse as MenuActionServerResponse;
                    if (response != null && response != undefined) {
                        this.convertAPIDataToTableRowData(response) ;
                        this.auditActionPagging = this.auditActionBindedData.slice(this.pagination.pageRequest.page*this.pagination.maxSize, this.pagination.pageRequest.page*this.pagination.maxSize + this.pagination.maxSize);
                        this.pagination.totalItems = this.auditActionBindedData.length;
                    } else {
                        this.auditActionDto = {};
                        this.auditActionBindedData.push(new MenuActivitiesPerRow());
                        this.auditActionPagging = [];
                    }
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
                default: {
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
            }
        }, error => {
            this.blockUI.stop();
            this.disableSearch = false;
            console.log('error onSearchDeals', error);
        });
    }

    onSearch(): void {
        this.disableSearch = true;
        this.pagination.pageRequest.reset();
        if(this.validateInput()) {
            this.auditActionDto = {};
            this.auditActionBindedData = [];
            this.auditActionPagging = [];
            this.loadData();
            this.buildTableHeader();
            this.filter.unbind();
        }
    }

    onReset(): void {
        this.filter = new AuditActionFilter();
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        this.filter.unbind();
    }

    buildTableHeader(): void {
        let settingsProductSearch: object = {};
        settingsProductSearch['searchPeriod'] = {
            title: 'monitorUserActivities.column.searchPeriod',
            width: '250px',
            align: 'center',
            render: (data: { item: MenuActivitiesPerRow, value: any }, settings: object) => {
                return data.item['searchPeriod'];
            }
        };
        settingsProductSearch['menuName'] = {
            title: 'monitorUserActivities.column.menuName',
            width: '500px',
            align: 'center',
            render: (data: { item: MenuActivitiesPerRow, value: any }, settings: object) => {
                return data.item['menuName'];
            }
        };
        settingsProductSearch['count'] = {
            title: 'monitorUserActivities.column.count',
            width: '150px',
            align: 'right',
            render: (data: { item: MenuActivitiesPerRow, value: any }, settings: object) => {
                return data.item['totalMenuCount'];
            }
        };
        this.sellers.forEach(seller => {
            seller.settingsForShow.forEach(setting => {
                if (setting.fieldName === 'totalButton') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: MenuActivitiesPerRow, value: any }, settings: object) => {
                            return '<span style="color:blue">' + data.item['totalButtonCount'] + '</span>';
                        }
                    };
                }

                if (setting.fieldName === 'searchButton') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: MenuActivitiesPerRow, value: any }, settings: object) => {
                            return data.item['searchCount'];
                        }
                    };
                }

                if (setting.fieldName === 'excelDownloadButton') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: MenuActivitiesPerRow, value: any }, settings: object) => {
                            return data.item['downloadCount'];
                        }
                    };
                }

                if (setting.fieldName === 'etc') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: MenuActivitiesPerRow, value: any }, settings: object) => {
                            return data.item['etcCount'];
                        }
                    };
                }
            });
        });
        this.activityDataSettings = {
            table: this.activityDataSettings['table'],
            column: settingsProductSearch
        };

    }

    validateInput(){
        return true;
    }

    convertAPIDataToTableRowData(response:MenuActionServerResponse): void {
        let listObjs = response.data ;
        if (listObjs == null || listObjs.length == 0) {
            this.auditActionBindedData = [];
        } else {
            this.auditActionBindedData = [];
            listObjs.forEach(item => {
                let competitor: MenuActionDto = item;
                let row = new MenuActivitiesPerRow();
                if (competitor != null) {
                    row.searchPeriod = competitor.searchPeriod;
                    row.menuName = competitor.menuName;
                    row.totalMenuCount = competitor.totalMenuCount;
                    row.totalButtonCount = competitor.totalButtonCount;
                    row.searchCount = competitor.searchCount;
                    row.downloadCount = competitor.downloadCount;
                    row.etcCount = competitor.etcCount;

                }
                this.auditActionBindedData.push(row)
            });
        }
    }

}