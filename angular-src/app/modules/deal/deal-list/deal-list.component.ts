import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IMyDpOptions} from 'mydatepicker'
import {Subscription} from 'rxjs/Subscription';

import {DealService} from '../services/deal-service';
import {BlockUIService} from '../../../shared/services/block-ui.service';
import {CompCategoryOnDepthResponse, DealSale, DealSaleFilter, DealSalePageResponse} from '../models/deal-sale';
import {PageRequest} from '../../../shared/models/page-request';
import {BadRequestResponse} from '../../../shared/models/bad-request-response';
import RouteUtils from '../../../shared/utils/RouteUtils';
import {DialogService} from "ng2-bootstrap-modal";
import {Pagination} from "../../../shared/models/pagination";
import {RowDetailsComponent} from "./row-details/row-details.component";
import {ComptitorSalesAndOptionsResponse} from "../../../shared/models/option";
import {OptionService} from "../../../shared/services/option.service";
import {CategoryGroupsInDetailResponse} from "../../competitor/models/competitor-by-category";
import {CompetitorService} from "../../competitor/services/competitor-service";
import {showErrorPopup} from "../../../shared/utils";
import {TranslateService} from "@ngx-translate/core";
import * as moment from 'moment';
import {CategoryDepthEnum} from "../../product-best-options/models/product-history-matching";
import {NotificationService} from "../../admin/notification/service/notification-service";
import {CookieService} from "ngx-cookie";
import {NotificationDialogComponent} from "../../admin/notification/dialog/notification-dialog.component";
import {Notification} from "../../admin/notification/models/Notification";
import {AuthGuard} from "../../../shared/services/auth.service";
const CURRENT_URL = '/deal-list';
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const PARSE_DATE_TIME_FORMAT = "YYYY/MM/DD";
const PARSE_DATE_TIME_FORMAT2 = "YYYY-MM-DD";
const PAGE_ID = "DEAL_LIST";

@Component({
    templateUrl: 'deal-list.component.html',
    styleUrls: ['deal-list.component.css']

})
export class DealListComponent implements OnInit, OnDestroy {

    constructor(private dealService: DealService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService,
                private dialogService: DialogService,
                private optionService: OptionService,
                private competitorService: CompetitorService,
                private translateService: TranslateService,
                private notificationService: NotificationService,
                private authGuard: AuthGuard,
                private cookieService: CookieService
    ) {
        this.blockUI.vRef = this.viewContainerRef;

        this.keysortMap.set('startDate', 'startdate');
        this.keysortMap.set('endDate', 'enddate');
        this.keysortMap.set('msCat1Title', 'parent_no');
        this.keysortMap.set('msCat2Title', 'category_no');
        this.keysortMap.set('title', 'title');
        this.keysortMap.set('sellCount', 'sell_count');;
        this.keysortMap.set('sales', 'sales');
        this.keysortMap.set('coId', 'co_id');
        this.keysortMap.set('dealId', 'deal_id');

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

    navSubscription: Subscription;

    isInit:boolean=false;

    ngOnInit(): void {
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

        this.onLoadDepartments();
        //this.handleApiRequest();
        this.isInit = false ;
        this.dealSaleFilter.isFullAccess = this.isFullAccess();
    }

    isFullAccess(): boolean {
        let rtn:boolean = false ;
        this.dealSaleFilter.userId = window.localStorage.getItem('username');
        this.dealSaleFilter.userRole = window.localStorage.getItem('role');
        if ((this.dealSaleFilter.userRole === 'admin') || (this.dealSaleFilter.userId === 'ykkong') ||
            (this.dealSaleFilter.userId === 'hankt') || (this.dealSaleFilter.userId === 'jeonsem')) {
            rtn = true;
        }

        return rtn;
    }

    handleApiRequest(): void {
        this.resetPreviousCellClick();
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let contextRoot = event["url"];
            let params = RouteUtils.extractParams(this.route, {});
            console.log("onFindDealSales");
            this.dealSaleFilter.bind(params);
            this.pagination.pageRequest.reset();
            this.onFindDealSales();
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

                    if (this.dealSaleFilter.departmentId !== '') {
                        this.teams = this.departmentMap[this.dealSaleFilter.departmentId];
                    }
                    if (this.dealSaleFilter.isFullAccess) {
                        this.filterDepartmentWithRoles();
                    }
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

    companies = [{coId: 'tmn', name: 'TMN'}, {coId: 'wmp', name: 'WMP'}];
    departments = [];
    departmentMap = {};
    categoryMapNoAndName = {};
    teams = [];
    assignedCategoriesInRole: string[] = [];
    role: string;


    currency: string = '' ;

    keysortMap: Map<string, string> = new Map<string, string>();

    dealSaleFilter: DealSaleFilter = new DealSaleFilter();

    dealSales: Array<DealSale> = [];

    subRows: object = {};
    previousCellActionIndex: number = -1;

    chartTypeInRow: number = 0;

    categoryDepth1Items = [];
    categoryDepth2Items = [];
    categoryDepth3Items = [];
    regexDealNumberList = "^(\\s*|)\\d+(((\\s*|),(\\s*|)\\d+)*\\d+)?$";

    dealSaleTableSettings = {
        table: {
            //width: '3000px',
            translate: true,
            tableScroll: true,
            tableScrollHeight: '500px'

        },
        column: {
            coId: {
                title: 'deal.coId',
                sortable: true,
                align: 'center',
                width:'100px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.item['coId'] == 'wmp' ? 'WMP' : 'TMN';
                }

            },
            startDate: {
                title: 'deal.startDate',
                sortable: true,
                align: 'center',
                width:'100px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return (data.item['startDate'] != null ? moment(data.item['startDate'], DATE_TIME_FORMAT).format(PARSE_DATE_TIME_FORMAT) : '');
                }

            },
            endDate: {
                title: 'deal.endDate',
                sortable: true,
                align: 'center',
                width:'100px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return (data.item['endDate'] != null ? moment(data.item['endDate'], DATE_TIME_FORMAT).format(PARSE_DATE_TIME_FORMAT) : '');
                }
            },
            msCat1Title: {
                title: 'deal.msCat1Title',
                sortable: true,
                width:'150px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return this.categoryMapNoAndName[data.item['msCat1Title']] != undefined ? this.categoryMapNoAndName[data.item['msCat1Title']] : '';
                }

            },
            msCat2Title: {
                title: 'deal.msCat2Title',
                sortable: true,
                width:'150px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return this.categoryMapNoAndName[data.item['msCat2Title']] != undefined ? this.categoryMapNoAndName[data.item['msCat2Title']] : '';
                }
            },
            dealId: {
                title: 'deal.dealId',
                sortable: true,
                width:'100px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.item['dealId'];
                }
            },
            title: {
                title: 'deal.title',
                width: '250px',
                render: (data: { value: any, item: object }, settings: object) => {

                    var url = 'http://www.ticketmonster.co.kr/deal/' + data.item['dealId'];
                    if (data.item['coId'] == 'wmp') {
                        if (data.item['dealId'] != null && data.item['dealId'].length == 9 && data.item['dealId'].charAt(0) == '1')
                            url = 'https://front.wemakeprice.com/product/' + data.item['dealId'];
                        else if (data.item['dealId'] != null && data.item['dealId'].length == 9 && data.item['dealId'].charAt(0) == '6')
                            url = 'https://front.wemakeprice.com/deal/' + data.item['dealId'];
                        else if (data.item['dealId'] != null && data.item['dealId'].length == 9 && data.item['dealId'].charAt(0) == '2')
                            url = 'https://front.wemakeprice.com/product/' + data.item['dealId'];
                        else
                            url = 'http://wemakeprice.com/deal/adeal/' + data.item['dealId'];
                    }

                    return '<a href="' + url + '" target="_blank">' + data.value + '</a>';
                },
            },
            priceOrigin: {
                title: 'deal.priceOrigin',
                type: 'number',
                width:'150px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.value.toLocaleString() + this.currency;
                }
            },
            discount: {
                title: 'deal.discount',
                type: 'percent',
                align: 'center',
                width:'150px',
                render: (data: { value: any, item: object }, settings: object) => {
                    let priceOrigin: number = data.item['priceOrigin'];
                    let priceNow: number = data.item['priceNow'];
                    let val = 0;
                    if (priceOrigin > 0) {
                        val = Math.round(((priceOrigin - priceNow) / priceOrigin) * 100);
                    }

                    return settings['formatter']({value: val, item: data.item}, settings);
                }
            },
            priceNow: {
                title: 'deal.priceNow',
                type: 'number',
                width:'150px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.value.toLocaleString() + this.currency;
                }
            },
            sellCount: {
                title: 'deal.sellCount',
                sortable: true,
                align: 'center',
                type: 'number',
                width:'150px'
            },
            sales: {
                title: 'deal.sales',
                sortable: true,
                type: 'number',
                width:'150px',
                render: (data: { value: any, item: object }, settings: object) => {
                    let endDate = moment(data.item['endDate'], PARSE_DATE_TIME_FORMAT2).toDate();
                    let searchedStartDate = moment(this.dealSaleFilter.startDate.formatted, PARSE_DATE_TIME_FORMAT2).toDate();
                    if(this.dealSaleFilter.typeSale == 1) {
                        settings['clickable'] = (searchedStartDate <= endDate) ? true : false;
                    }else
                        settings['clickable'] = true;
                    return data.value.toLocaleString() + this.currency;
                }
            },
            orgCat1: {
                title: 'deal.orgCat1',
                width:'250px',
                render: (data: { value: any, item: object }, settings: object) => {

                    var orgRoot = data.item['class1'];
                    var orgSeparate1 = orgRoot == '' ? '' : ' > ';
                    var orgLevel2 = data.item['class2'];
                    var orgLevel4 = data.item['class3'];

                    var orgSeparate2 = orgLevel2 == '' ? '' : ' > ';
                    var orgLevel3 = data.item['category'];

                    var orgSeparate3 = orgLevel3 == '' ? '' : ' > ';

                    var path12 =  (orgRoot + orgSeparate1 + orgLevel2);
                    var path34 = orgSeparate2 + orgLevel3;
                    if(orgLevel4 !==''){
                        path34 =  orgSeparate2 + orgLevel4 + orgSeparate3 +  orgLevel3 ;
                    }

                    return (path12 + path34);

                }
            },
            shopName: {
                title: 'deal.shopName',
                width:'100px'
            },
            shopTel: {
                title: 'deal.shopTel',
                width:'100px'
            },
            shopAddress: {
                title: 'deal.shopAddress',
                width:'100px'
            }
        },
        row: {
            renderSubRow: (item: object, settings: object, rowIndex: number) => {
                if (this.subRows[rowIndex]) {
                    return {
                        component: RowDetailsComponent,
                        inputs: {
                            sources: this.competitorSales,
                            options: this.options,
                            chartType: this.chartTypeInRow
                        }
                    };
                }
                return false;
            }
        }
    };

    cat1: Array<string> = [];
    cat2: Array<string> = [];
    options: any = [];
    competitorSales: any = [];

    pagination: Pagination = new Pagination(new PageRequest);

    myDatePickerOptions: IMyDpOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    handleDepartmentChanged(event) {
        let department = event.target.value;
        this.dealSaleFilter.departmentId = department;
        this.loadTeamsByDepartment(true);
        this.dealSaleFilter.categoryDepth1 = "";
        this.dealSaleFilter.categoryDepth2 = "";
        this.dealSaleFilter.categoryDepth3 = "";
    }

    loadTeamsByDepartment(reset = false) {
        let department = this.dealSaleFilter.departmentId;
        let teams = [];
        if (department !== '') {
            teams = this.departmentMap[department];
        }
        this.teams = teams;
        if (reset) {
            this.dealSaleFilter.teamId = '';
        }
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pagination.pageRequest.page = event.page - 1;
            this.dealSales = null;
            this.resetPreviousCellClick();
            this.onFindDealSales();
        }
    }

    onExportExcel() : void {
        if(this.validateDealInput()) {
            console.log("onExportExcel: ");
            console.log(this.pagination);
            this.dealService.exportDealSalesToExcel(this.dealSaleFilter, this.categoryDepth1Items, this.categoryDepth2Items, this.categoryDepth3Items, this.pagination.pageRequest);
        }
    }

    onSearch(): void {
        if (this.isInit) {
            if (this.validateDealInput()) {
                this.resetPreviousCellClick();
                RouteUtils.navigateTo(this.router, CURRENT_URL, this.dealSaleFilter.unbind(), true);
            }
        } else {
            this.isInit = true ;
            this.handleApiRequest() ;
        }
    }

    onReset(): void {
        this.dealSaleFilter = new DealSaleFilter();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.dealSaleFilter.unbind());
        this.dealSales = [];
        this.resetPreviousCellClick();
        this.pagination = new Pagination(new PageRequest())
    }

    private onFindDealSales(): void {
        console.log("onFindDealSales: ");
        console.log(this.pagination);
        this.blockUI.start();

        this.dealService.getDealSales(this.dealSaleFilter, this.categoryDepth1Items, this.categoryDepth2Items, this.categoryDepth3Items, this.pagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);

                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let dealPageResp = serverResponse as DealSalePageResponse;
                    this.dealSales = dealPageResp.data;
                    this.pagination.totalItems = dealPageResp.pagination.total;
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop()
            }


        }, error => {
            console.log('error to find deal sales', error);
            this.blockUI.stop();
            let errorMessage = this.translateService.instant("message.err_unknown");
            showErrorPopup(this.dialogService, this.translateService, errorMessage);
        });
    }

    private onFindCompetitorSalesAndOptions(coId, dealId, coDealSrl, startDate, endDate): void {

        this.blockUI.start();

        this.optionService.getCompetitorSalesAndOptions(coId, dealId, coDealSrl, this.dealSaleFilter, startDate, endDate).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let response = serverResponse as ComptitorSalesAndOptionsResponse;
                    this.options = response.data.options;
                    this.competitorSales = response.data.salesOptions;
                    this.blockUI.stop();
                    //this.dealSaleTableSettings.table.subRowScroll = true;
                }
                default:
                    this.blockUI.stop();
            }


        }, error => {
            console.log('error to find deal sales', error);
            this.blockUI.stop();
            let errorMessage = this.translateService.instant("message.err_unknown");
            showErrorPopup(this.dialogService, this.translateService, errorMessage);
        });
    }

    handleDealSaleTableAction({action, data, event}) {

        if (action == 'sort') {
            this.dealSaleFilter.sort = this.keysortMap.get(data['column']) + ',' + data['type'];
            this.onSearch();
        } else if (action == 'cellclick') {
            let rowIndex = data.rowIndex;
            this.subRows[rowIndex] = !this.subRows[rowIndex];

            if (this.previousCellActionIndex != rowIndex)
                this.resetPreviousCellClick();

            this.previousCellActionIndex = rowIndex;

            if (this.subRows[rowIndex]) {
                this.competitorSales = [];
                this.options = [];
                let temp = data.item.coDealId;
                let dealId = temp;
                let coId = 'tmn';
                if (temp.length > 0) {
                    temp = temp.split("_");
                    if (temp.length > 1) {
                        dealId = temp[1];
                        coId = temp[0];
                    }
                }
                let startDate = moment(data.item.startDate, DATE_TIME_FORMAT).format(PARSE_DATE_TIME_FORMAT2);
                let endDate = moment(data.item.endDate, DATE_TIME_FORMAT).format(PARSE_DATE_TIME_FORMAT2);
                this.onFindCompetitorSalesAndOptions(coId, dealId, data.item.srl, startDate, endDate);

            }

        }

    }

    resetPreviousCellClick(): void {
        this.subRows[this.previousCellActionIndex] = false;
    }

    filterDepartmentWithRoles() : void {
        let assignedCategories = window.localStorage.getItem("assignedCategories");
        this.role = window.localStorage.getItem("role");
        if(assignedCategories != null && assignedCategories != '' && this.role !== 'admin') {
            this.assignedCategoriesInRole = assignedCategories.split(";");
            this.departments = [];
            this.assignedCategoriesInRole.forEach(e => {
                this.departments.push({name: this.categoryMapNoAndName[e], id: e});
                if(this.departments.length === 1) {
                    this.dealSaleFilter.departmentId = this.assignedCategoriesInRole[0];
                }
            });
            this.dealSaleFilter.departmentId = this.assignedCategoriesInRole[0];
            this.loadTeamsByDepartment(true);
        }
    }

    validateDealInput(){
        let errorElement: HTMLElement = document.getElementById('errorDealNameSp');
        if(this.dealSaleFilter.searchDealName !=='' && this.dealSaleFilter.searchDealName.length < 2){
            errorElement.setAttribute("style", "color:red; display:block");
            return false;
        }
        let errorDealNumElement: HTMLElement = document.getElementById('errorDealNumSp');
        if(this.dealSaleFilter.searchDealNumber !=='' && this.dealSaleFilter.searchDealNumber != undefined){
            if (!this.dealSaleFilter.searchDealNumber.match(this.regexDealNumberList)) {
                errorDealNumElement.setAttribute("style", "color:red; display:block");
                return false;
            }
        }

        errorElement.setAttribute("style", "display:none");
        errorDealNumElement.setAttribute("style", "display:none");

        return true;
    }

    validateRange() {
        /*let searchStartDate: Date = moment(this.dealSaleFilter.startDate.formatted, PARSE_DATE_TIME_FORMAT2).toDate();
        let searchEndDate: Date = moment(this.dealSaleFilter.endDate.formatted, PARSE_DATE_TIME_FORMAT2).toDate();
        let diff: number = ((searchStartDate.getTime() - searchEndDate.getTime())/(1000*60*60*24.0))
        if (Math.abs(diff) > 90 ){
            return false;
        }
        */
        return true;
    }

    handleShowCategoryDepth(type: CategoryDepthEnum): void {

        switch (type) {
            case CategoryDepthEnum.Depth1: {
                this.onLoadCategoryDepth(this.dealSaleFilter, 1, null, null);
                break;
            }
            case CategoryDepthEnum.Depth2: {
                if (this.dealSaleFilter.categoryDepth1 !== '') {
                    this.onLoadCategoryDepth(this.dealSaleFilter, 2, 1, this.dealSaleFilter.categoryDepth1);
                }
                break;
            }
            case CategoryDepthEnum.Depth3: {
                if (this.dealSaleFilter.categoryDepth2 !== '') {
                    this.onLoadCategoryDepth(this.dealSaleFilter, 3, 2, this.dealSaleFilter.categoryDepth2);
                }
                break;
            }
        }


    }

    handleCategoryChange(type: CategoryDepthEnum): void {
        switch (type) {
            case CategoryDepthEnum.Depth1: {
                this.dealSaleFilter.categoryDepth2 = "";
                this.dealSaleFilter.categoryDepth3 = "";
                this.categoryDepth2Items = [];
                this.categoryDepth3Items = [];
                break;
            }
            case CategoryDepthEnum.Depth2: {

                this.dealSaleFilter.categoryDepth3 = "";
                this.categoryDepth3Items = [];
                break;
            }
            case CategoryDepthEnum.Depth3: {
                break;
            }
        }
    }

    onLoadCategoryDepth(filter: DealSaleFilter, curDepth: number, reqDepth: number, comCategoryNo: string): void {
        this.blockUI.start();
        this.dealService.onLoadCategoryDepth(filter, reqDepth, comCategoryNo).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                }
                case 'OK': {
                    let response = serverResponse as CompCategoryOnDepthResponse;
                    switch (curDepth) {
                        case CategoryDepthEnum.Depth1:
                            this.categoryDepth1Items = response.data;
                            break;
                        case CategoryDepthEnum.Depth2:
                            this.categoryDepth2Items = response.data;
                            break;
                        case CategoryDepthEnum.Depth3:
                            this.categoryDepth3Items = response.data;
                            break;
                    }
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error onLoadCategoryDepth', error);
            this.blockUI.stop();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });

    }

    resetCategoryFilter(): void {
        this.categoryDepth1Items = [];
        this.categoryDepth2Items = [];
        this.categoryDepth3Items = [];
        this.dealSaleFilter.categoryDepth1 = "";
        this.dealSaleFilter.categoryDepth2 = "";
        this.dealSaleFilter.categoryDepth3 = "";
    }

    handleCoIdChanged(event) : void {
        this.dealSaleFilter.departmentId = "";
        this.dealSaleFilter.teamId = "";
        this.dealSaleFilter.categoryDepth1 = "";
        this.dealSaleFilter.categoryDepth2 = "";
        this.dealSaleFilter.categoryDepth3 = "";
    }

    handleTeamChanged(event) : void {
        this.dealSaleFilter.categoryDepth1 = "";
        this.dealSaleFilter.categoryDepth2 = "";
        this.dealSaleFilter.categoryDepth3 = "";
    }

    handleDateChanged(event) : void {
        this.dealSaleFilter.categoryDepth1 = "";
        this.dealSaleFilter.categoryDepth2 = "";
        this.dealSaleFilter.categoryDepth3 = "";
    }

}

