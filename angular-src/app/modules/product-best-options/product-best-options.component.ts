import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogService} from "ng2-bootstrap-modal";
import {Subscription} from "rxjs/Subscription";
import {ProductPriceComparisonFilter} from "./models/product-price-comparison";
import {
    CategoryDepthEnum,
    ProductHistoryBestOptionServerResponse,
    ProductHistoryDetailsServerResponse,
    ProductHistoryDTO,
    ProductHistoryMatchingTableRow
} from "./models/product-history-matching";
import * as moment from "moment";
import {CompetitorService} from "../competitor/services/competitor-service";
import {BlockUIService} from "../../shared/services/block-ui.service";
import {Pagination} from "../../shared/models/pagination";
import {PageRequest} from "../../shared/models/page-request";
import RouteUtils from "../../shared/utils/RouteUtils";
import {formatNumber, showErrorPopup} from "../../shared/utils/index";
import {BadRequestResponse} from "../../shared/models/bad-request-response";
import {ProductOptionsRowDetailsComponent} from "./product-options-row-details/product-options-row-details.component";
import {ProductRankOptionValueComponent} from "./product-rank-option-value/product-rank-option-value.component";
import {ProductBestOptionService} from "./service/product-best-option-service";
import {CookieService} from "ngx-cookie";
import {NotificationService} from "../admin/notification/service/notification-service";
import {NotificationDialogComponent} from "../admin/notification/dialog/notification-dialog.component";
import {Notification} from "../admin/notification/models/Notification";
import {AuthGuard} from "../../shared/services/auth.service";

const DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const PARSE_DATE_TIME_FORMAT = "YYYY-MM-DD";
const PRODUCT_BEST_OPTION_URL = '/product-best-options';
const PAGE_ID = "PRO_BEST_OPT";

@Component({
    selector: 'app-product-best-options',
    templateUrl: './product-best-options.component.html',
    styleUrls: ['./product-best-options.component.css']
})

export class ProductBestOptionsComponent implements OnInit {

    constructor(private productBestOptionService: ProductBestOptionService,
                private competitorService: CompetitorService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService,
                private notificationService: NotificationService,
                private authGuard: AuthGuard,
                private cookieService: CookieService
    ) {

        this.pagination.pageRequest.reset();
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


    navSubscription: Subscription;
    queryParamsSubscription: Subscription;
    numberOfLastDaysSearchAllowed: number = 3;

    lineNo: number = 0;

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe()
        }
    }

    productHistoryMatchings: ProductHistoryDTO[];
    pagination: Pagination = new Pagination(new PageRequest());
    totalProductCount: number = 0;
    filter: ProductPriceComparisonFilter = new ProductPriceComparisonFilter();

    subRows: object = {};
    previousCellActionIndex: number = -1;

    productHistDetails: ProductHistoryDTO[] = [];

    dataSettings: object = {
        table: {
            //width: '2550px',
            translate: true,
            tableScroll: true,
            tableScrollHeight: '500px'
        }
    };

    competitors = [
        {coId: 'wmp', name: 'WMP'},
        {coId: 'gmrk', name: 'GMK'},
    ];

    categoryDepth1Items = [];
    categoryDepth2Items = [];
    categoryDepth3Items = [];

    removeDuplicatedRank: boolean = true;
    exposeMainDeal: boolean = false;
    showColumns: boolean = true;

    isAdminView: boolean = true;

    onPaginationChanged(event: any): void {
        //if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
        this.bindedDataContents = [];
        let pageNumReq: number = event.page - 1;
        this.pagination.pageRequest.page = pageNumReq;
        this.lineNo = (event.page - 1) * event.itemsPerPage;
        this.resetPreviousCellClick();
        this.onSearchProductBestOptions();
        //}
    }

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
        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
            let role = window.localStorage.getItem("role");
            this.isAdminView = (params['isAdminView'] === 'true') && role === 'admin';
        });
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, PRODUCT_BEST_OPTION_URL, (event) => {
            // skip search on load page
            let params = RouteUtils.extractParams(this.route, {});
            this.filter.bind(params);
            this.onSearchProductBestOptions();
        });
        this.buildTableHeader();
    }


    onSearch(): void {
        this.resetData();
        this.resetPreviousCellClick();
        this.buildTableHeader();
        if (this.validateDealNameInput()) {
            RouteUtils.navigateTo(this.router, PRODUCT_BEST_OPTION_URL, this.filter.unbind(), true);
        }
    }

    resetData() {
        this.bindedDataContents = [];
        this.pagination = new Pagination(new PageRequest());
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
    }

    onReset(): void {
        this.filter = new ProductPriceComparisonFilter();
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        RouteUtils.navigateTo(this.router, PRODUCT_BEST_OPTION_URL, this.filter.unbind());
    }

    onExportExcel(): void {
        if (this.validateDealNameInput()) {
            this.productBestOptionService.onExportExcelProductBestOptions(this.filter);
        }
    }

    bindedDataContents: ProductHistoryMatchingTableRow[] = [];

    buildTableHeader(): void {

        let settings: object = {
            no: {
                title: 'productComparison.no',
                width: '50px',
                align: 'center',
            },
            competitorName: {
                title: 'productComparison.competitor',
                width: '100px',
                align: 'center'
            }
        };
        if (this.isAdminView) {
            settings['totalPoint'] = {
                title: 'productComparison.point',
                width: '100px',
                align: 'center'
            };
        }
        settings['rank'] = {
            title: ['productComparison.rank'],
            renderType: 'cmp',
            width: '200px',
            align: 'center',
            renderCmp: (data: { value: any, item: object }, settings: object) => {
                return {
                    component: ProductRankOptionValueComponent,
                    inputs: {
                        rank: data.item['rank'],
                        rankGap: data.item['rankGap'],
                    }
                }
            }

        };

        settings['dealId'] = {
            title: ['productComparison.dealId'],
            width: '150px',
            align: 'center'
        };

        if (this.showColumns) {

            //this.dataSettings['table']['width'] = '2550px';

            settings['dealName'] = {
                title: ['productComparison.dealName'],
                width: '250px',
                render: (data: { value: any, item: object }, settings: object) => {
                    return '<a href="' + data.item['dealURL'] + '" target="_blank">' + data.value + '</a>';
                }
            };
            settings['priceOrigin'] = {
                title: ['productComparison.priceOrigin'],
                width: '150px',
                align: 'center',
                render: (data: { value: any, item: object }, settings: object) => {
                    return `${formatNumber(data.item['priceOrigin'])}`;
                }
            };
            settings['priceNow'] = {
                title: ['productComparison.priceNow'],
                width: '150px',
                align: 'center',
                render: (data: { value: any, item: object }, settings: object) => {
                    let price = data.item['priceNow'];
                    let priceGap = data.item['priceGap'];
                    //settings['clickable'] = true;
                    return `${formatNumber(price)}(${priceGap > 0 ? '+' + priceGap : priceGap})`;
                }
            };
        }

        settings['title'] = {
            title: ['productComparison.optionName'],
            width: '200px',
        };

        settings['optionPriceNow'] = {
            title: ['productComparison.optionPriceNow'],
            width: '150px',
            align: 'center',
            render: (data: { value: any, item: object }, settings: object) => {
                settings['clickable'] = true;
                return `${formatNumber(data.item['optionPriceNow'])}`;
            }
        };

        if (this.filter.coId === 'wmp') {
            settings['sellCount'] = {
                title: ['productComparison.sellCount'],
                width: '100px',
                align: 'center',
                render: (data: { value: any, item: object }, settings: object) => {
                    let sellCount = data.item['sellCount'];
                    let sellCountGap = data.item['sellCountGap'];
                    return `${sellCount}(${sellCountGap > 0 ? '+' + sellCountGap : sellCountGap})`;
                }
            };
        }


        settings['deliveryInfo'] = {
            title: ['productComparison.deliveryInfo'],
            width: '300px',
            align: 'center'
        };
        settings['categoryPath'] = {
            title: ['productComparison.categoryPath'],
            width: '250px',
            render: (data: { value: any, item: object }, settings: object) => {
                return `${data.item['category1'] === null ? '' : data.item['category1']} > 
                ${data.item['category2'] === null ? '' : data.item['category2']} > 
                ${data.item['category3'] === null ? '' : data.item['category3']}`;
            }
        };
        settings['partnerName'] = {
            title: ['productComparison.partnerName'],
            width: '200px',
            align: 'center'
        };
        if (this.filter.coId === 'gmrk') {
            settings['partnerBusinessNo'] = {
                title: ['productComparison.partnerBusinessNo'],
                width: '200px',
                align: 'center'

            };
            settings['partnerPhone'] = {
                title: ['productComparison.partnerPhone'],
                width: '200px',
                align: 'center'

            };
        }
        this.dataSettings = {
            table: this.dataSettings['table'],
            column: settings,
            row: {
                renderSubRow: (item: object, settings: object, rowIndex: number) => {
                    if (this.subRows[rowIndex]) {
                        return {
                            component: ProductOptionsRowDetailsComponent,
                            inputs: {
                                sources: this.productHistDetails,
                                coId: item['coId'],
                                removeDuplicatedRank: this.removeDuplicatedRank,
                                isAdminView: this.isAdminView
                            }
                        };
                    }
                    return false;
                }
            }
        };
    }

    onSearchProductBestOptions(): void {
        this.blockUI.start();

        this.onGetTotalProductBestOptions();

        this.productBestOptionService.onSearchProductBestOption(this.filter, this.pagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    break;
                }
                case 'OK': {
                    let response = serverResponse as ProductHistoryBestOptionServerResponse;
                    this.productHistoryMatchings = [];
                    this.productHistoryMatchings = response.data;
                    this.convertAPIDataToTableRowData();
                    this.blockUI.stop();
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error onSearchProductBestOptions', error);
            this.blockUI.stop();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
    }
    onGetTotalProductBestOptions(): void {
        //this.blockUI.start();
        this.productBestOptionService.onGetTotalProductBestOptions(this.filter).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    break;
                }
                case 'OK': {
                    this.pagination.totalItems = serverResponse.data;
                    //this.blockUI.stop();
                    this.totalProductCount = serverResponse.data[0];
                    this.pagination.totalItems = serverResponse.data[1];
                }
            }
            //this.blockUI.stop();
        }, error => {
            console.log('error onSearchProductBestOptions', error);
            this.blockUI.stop();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
    }


    convertAPIDataToTableRowData(): void {
        if (this.productHistoryMatchings == null || this.productHistoryMatchings.length == 0) {
            this.bindedDataContents = [];
        } else {
            this.bindedDataContents = [];
            this.productHistoryMatchings.forEach(item => {
                let row = new ProductHistoryMatchingTableRow();
                if (item != null) {
                    row.no = ++this.lineNo;
                    row.rank = item.rank;
                    row.rankGap = item.rankGap;

                    row.category1 = item.cat1Name === undefined ? '' : item.cat1Name;
                    row.category2 = item.cat1Name === undefined ? '' : item.cat2Name;
                    row.category3 = item.cat3Name === undefined ? '' : item.cat3Name;
                    row.coId = item.coId;
                    row.competitorName = this.competitors.find(comp => comp.coId === item.coId).name.toUpperCase();
                    row.date = moment(item.createdAt, DATE_TIME_FORMAT).format(PARSE_DATE_TIME_FORMAT);
                    row.dealId = item.productCode;
                    row.dealName = item.name;
                    row.dealURL = item.url;
                    row.deliveryInfo = item.deliveryInfo;

                    row.priceOrigin = item.priceOrigin;
                    row.priceNow = item.priceNow;
                    row.priceGap = item.priceGap;
                    if (item.partnerInfo != undefined && item.partnerInfo != null) {
                        row.partnerName = item.partnerInfo.name === null ? '' : item.partnerInfo.name;
                        row.partnerPhone = item.partnerInfo.phoneNumber === null ? '' : item.partnerInfo.phoneNumber;
                        row.partnerBusinessNo = item.partnerInfo.bussinessNumber === null ? '' : item.partnerInfo.bussinessNumber;
                    }
                    row.sellCount = item.sellCount;
                    row.sellCountGap = item.sellCountGap;
                    row.totalPoint = item.totalPoint;
                    row.title = item.title;
                    row.optionPriceNow = item.optionPriceNow;
                    row.optionId = item.optionId;
                }

                this.bindedDataContents.push(row);


            });

        }
    }

    onLoadCategoryDepth(filter: ProductPriceComparisonFilter, curDepth: number, reqDepth: number, comCategoryNo: string): void {
        this.blockUI.start();
        this.productBestOptionService.onLoadCategoryDepth(filter, reqDepth, comCategoryNo).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                }
                case 'OK': {

                    switch (curDepth) {
                        case CategoryDepthEnum.Depth1:
                            this.categoryDepth1Items = serverResponse.data;
                            break;
                        case CategoryDepthEnum.Depth2:
                            this.categoryDepth2Items = serverResponse.data;
                            break;
                        case CategoryDepthEnum.Depth3:
                            this.categoryDepth3Items = serverResponse.data;
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

    private onGetBestOptionHistoryDetails(coId, productId, optionId): void {

        this.blockUI.start();

        this.productBestOptionService.onGetBestOptionsHistoryDetails(this.filter, coId, productId, optionId ).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let response = serverResponse as ProductHistoryDetailsServerResponse;
                    this.productHistDetails = response.data;
                    this.blockUI.stop();
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

    handleTableChange({action, data, event}) {
        if (action == 'cellclick') {
            let rowIndex = data.rowIndex;
            this.subRows[rowIndex] = !this.subRows[rowIndex];

            if (this.previousCellActionIndex != rowIndex)
                this.resetPreviousCellClick();

            this.previousCellActionIndex = rowIndex;

            if (this.subRows[rowIndex]) {
                this.productHistDetails = [];
                let coId: string = data.item.coId;
                let productId: string = data.item.dealId;
                let optionId: number = data.item.optionId;

                //let productId: string = "373058782";
                //let optionId: number = 25811295264;

                this.onGetBestOptionHistoryDetails(coId, productId, optionId);

            }

        }
    }

    resetPreviousCellClick(): void {
        this.subRows[this.previousCellActionIndex] = false;
    }

    handleShowCategoryDepth(type: CategoryDepthEnum): void {

        switch (type) {
            case CategoryDepthEnum.Depth1: {
                this.onLoadCategoryDepth(this.filter, 1, null, null);
                break;
            }
            case CategoryDepthEnum.Depth2: {
                if (this.filter.categoryDepth1 !== '') {
                    this.onLoadCategoryDepth(this.filter, 2, 1, this.filter.categoryDepth1);
                }
                break;
            }
            case CategoryDepthEnum.Depth3: {
                if (this.filter.categoryDepth2 !== '') {
                    this.onLoadCategoryDepth(this.filter, 3, 2, this.filter.categoryDepth2);
                }
                break;
            }
        }


    }

    handleCategoryChange(type: CategoryDepthEnum): void {
        switch (type) {
            case CategoryDepthEnum.Depth1: {
                this.filter.categoryDepth2 = "";
                this.filter.categoryDepth3 = "";
                this.categoryDepth2Items = [];
                this.categoryDepth3Items = [];
                break;
            }
            case CategoryDepthEnum.Depth2: {

                this.filter.categoryDepth3 = "";
                this.categoryDepth3Items = [];
                break;
            }
            case CategoryDepthEnum.Depth3: {
                break;
            }
        }
    }

    resetCategoryFilter(): void {
        this.categoryDepth1Items = [];
        this.categoryDepth2Items = [];
        this.categoryDepth3Items = [];
        this.filter.categoryDepth1 = "";
        this.filter.categoryDepth2 = "";
        this.filter.categoryDepth3 = "";
    }

    hidenOrShowColumns(event) {
        if (event.target.value == '-') {
            this.showColumns = false;
            event.target.value = '+';
        }
        else {
            this.showColumns = true;
            event.target.value = '-';
        }

        this.buildTableHeader();

    }

    validateDealNameInput() {
        let errorDealNameElement: HTMLElement = document.getElementById('errorDealNameSp');
        let errorOptionNameElement: HTMLElement = document.getElementById('errorOptionNameSp');
        if (this.filter.dealName !== '' && this.filter.dealName.length < 2) {
            errorDealNameElement.setAttribute("style", "color:red; display:block");
            return false;
        } else {
            errorDealNameElement.setAttribute("style", "display:none");
        }

        if (this.filter.optionName !== '' && this.filter.optionName.length < 2) {
            errorOptionNameElement.setAttribute("style", "color:red; display:block");
            return false;
        } else {
            errorOptionNameElement.setAttribute("style", "display:none");
        }

        return true;
    }

    selectDateChange() {
        console.log("selectDateChange");
    }


}
