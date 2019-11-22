import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogService} from "ng2-bootstrap-modal";
import {Subscription} from "rxjs/Subscription";
import {ProductPriceComparisonFilter} from "./models/product-price-comparison";
import {ProductPriceComparisonService} from "./service/product-price-comparison-service";
import {
    CategoryDepthEnum, ProductHistoryDetailsServerResponse,
    ProductHistoryDTO,
    ProductHistoryReportsServerResponse,
    ProductHistoryMatchingTableRow,
} from "./models/product-history-report";
import * as moment from "moment";
import {CompetitorService} from "../../competitor/services/competitor-service";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {Pagination} from "../../../shared/models/pagination";
import {PageRequest} from "../../../shared/models/page-request";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {formatNumber, showErrorPopup} from "../../../shared/utils";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import {ProductRowDetailsComponent} from "./product-row-details/product-row-details.component";
import {ProductRankValueComponent} from "./product-rank-value/product-rank-value.component";
import {NotificationDialogComponent} from "../notification/dialog/notification-dialog.component";
import {NotificationService} from "../notification/service/notification-service";
import {CookieService} from "ngx-cookie";
import {Notification} from "../notification/models/Notification";
import {AuthGuard} from "../../../shared/services/auth.service";

const DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const PARSE_DATE_TIME_FORMAT = "YYYY-MM-DD";
const PAGE_ID = "PRICE_COMPARE";

@Component({
    selector: 'app-product-price-comparison',
    templateUrl: './product-price-comparison.component.html',
    styleUrls: ['./product-price-comparison.component.css']
})

export class ProductPriceComparisonComponent implements OnInit {

    constructor(private productPriceService: ProductPriceComparisonService,
                private competitorService: CompetitorService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService,
                private notificationService: NotificationService,
                private authGuard: AuthGuard,
                private cookieService: CookieService) {

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

    lineNo: number = 0;
    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
        if(this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe()
        }
    }

    productHistoryReports: ProductHistoryDTO[];
    pagination: Pagination = new Pagination(new PageRequest());
    filter: ProductPriceComparisonFilter = new ProductPriceComparisonFilter();

    subRows: object = {};
    previousCellActionIndex: number = -1;

    productHistDetails:ProductHistoryDTO[] =[];

    dataSettings: object = {
        table: {
            //width: '2250px',
            translate: true,
            tableScroll: true,
            tableScrollHeight: '500px'
        }
    };
    competitors = [
        {coId: 'tmn', name: 'TMN'},
        {coId: 'wmp', name: 'WMP'},
        {coId: 'gmrk', name: 'GMK'},
    ];

    categoryDepth1Items = [];
    categoryDepth2Items = [];
    categoryDepth3Items = [];

    removeDuplicatedRank: boolean =true;

    isAdminView:boolean= false;

    onPaginationChanged(event: any): void {
        //if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
        let pageNumReq: number = event.page - 1;
        this.pagination.pageRequest.page = pageNumReq;
        this.lineNo = (event.page -1)* event.itemsPerPage;
        this.resetPreviousCellClick();
        this.onSearchProductHistoryMatching();
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

        this.queryParamsSubscription = this.route.queryParams.subscribe(params=> {
            let role = window.localStorage.getItem("role");
            this.isAdminView = (params['isAdminView']==='true') && role ==='admin';
        });
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, this.getComponentUrl(), (event) => {
                    // skip search on load page
                    let params = RouteUtils.extractParams(this.route, {});
                    this.filter.bind(params);
                    this.onSearchProductHistoryMatching();
                });
        this.buildTableHeader();
    }


    onSearch(): void {
        if(this.validateDealNameInput()) {
            this.pagination.pageRequest.reset();
            this.lineNo = 0;
            this.resetPreviousCellClick();
            this.buildTableHeader();
            RouteUtils.navigateTo(this.router, this.getComponentUrl(), this.filter.unbind(), true);
        }
    }

    onReset(): void {
        this.filter = new ProductPriceComparisonFilter();
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        RouteUtils.navigateTo(this.router,  this.getComponentUrl(), this.filter.unbind());
    }


    onExportExcel(): void {
        if(this.validateDealNameInput()) {
            this.productPriceService.onExportExcelProductHistoryMatching(this.filter);
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
        if(this.isAdminView) {
            settings['totalPoint'] = {
                title: 'productComparison.point',
                width: '100px',
                align: 'center'
            };
        }
        settings['rank'] = {
            title: ['productComparison.rank'],
            renderType:'cmp',
            width: '200px',
            align: 'center',
            renderCmp: (data: { value: any, item: object }, settings: object) => {
                return {
                    component: ProductRankValueComponent,
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
        settings['dealName'] = {
            title: ['productComparison.dealName'],
            width: '250px',
            render: (data: { value: any, item: object }, settings: object) =>{
                if (data.item['coId'] === 'tmn') {
                    return '<a href="' + 'http://www.ticketmonster.co.kr/deal/' + data.item['dealId'] + '" target="_blank">' + data.value + '</a>';
                }
                return '<a href="' + data.item['dealURL'] + '" target="_blank">' + data.value + '</a>';
            }
        };
        settings['priceOrigin'] = {
            title: ['productComparison.priceOrigin'],
            width: '150px',
            align: 'center',
            render : (data:  { value: any, item: object }, settings: object) => {
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
                settings['clickable'] =  true ;
                return `${formatNumber(price)}(${priceGap > 0 ? '+' + priceGap: priceGap})`;
            }
        };

        if(this.filter.coId ==='wmp') {
            settings['sellCount'] = {
                title: ['productComparison.sellCount'],
                width: '150px',
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
            width: '300px',
            render: (data: { value: any, item: object }, settings: object) => {
                return `${data.item['category1'] === null? '': data.item['category1']} > 
                ${data.item['category2'] === null? '': data.item['category2']} > 
                ${data.item['category3'] === null? '': data.item['category3']}`;
            }
        };
        settings['partnerName'] = {
            title: ['productComparison.partnerName'],
            width: '200px',
            align: 'center'
        };
        if(this.filter.coId ==='gmrk') {
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
                            component: ProductRowDetailsComponent,
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

    onSearchProductHistoryMatching(): void {
        this.blockUI.start();

        this.onGetTotalProductHistoryMatching();

        this.productPriceService.onSearchProductHistoryMatching(this.filter, this.pagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    break;
                }
                case 'OK': {
                    let response = serverResponse as ProductHistoryReportsServerResponse;
                    this.productHistoryReports = [];
                    this.productHistoryReports = response.data;
                    this.convertAPIDataToTableRowData();
                    this.blockUI.stop();
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error onSearchProductHistoryMatching', error);
            this.blockUI.stop();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
    }

    onGetTotalProductHistoryMatching(): void {
        //this.blockUI.start();
        this.productPriceService.onGetTotalProductHistoryMatching(this.filter).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    break;
                }
                case 'OK': {
                    this.pagination.totalItems = serverResponse.data;
                    //this.blockUI.stop();
                }
            }
            //this.blockUI.stop();
        }, error => {
            console.log('error onSearchProductHistoryMatching', error);
            this.blockUI.stop();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
    }


    convertAPIDataToTableRowData(): void {
        if (this.productHistoryReports == null || this.productHistoryReports.length == 0) {
            this.bindedDataContents = [];
        } else {
            this.bindedDataContents = [];
            this.productHistoryReports.forEach(item => {
                let competitor: ProductHistoryDTO = item;

                let row = new ProductHistoryMatchingTableRow();
                if (competitor != null) {
                    row.no = ++this.lineNo;
                    row.rank = competitor.rank;
                    row.rankGap = competitor.rankGap;

                    row.category1 = competitor.cat1Name === undefined ? '': competitor.cat1Name;
                    row.category2 = competitor.cat1Name === undefined ? '': competitor.cat2Name;
                    row.category3 = competitor.cat3Name === undefined ? '': competitor.cat3Name;
                    row.coId = competitor.coId;
                    row.competitorName = this.competitors.find(comp=> comp.coId === competitor.coId).name.toUpperCase();
                    row.date = moment(competitor.createdAt, DATE_TIME_FORMAT).format(PARSE_DATE_TIME_FORMAT);
                    row.dealId = competitor.productCode;
                    row.dealName = competitor.name;
                    row.dealURL = competitor.url;
                    row.deliveryInfo = competitor.deliveryInfo;

                    row.priceOrigin = competitor.priceOrigin;
                    row.priceNow = competitor.priceNow;
                    row.priceGap = competitor.priceGap;
                    if(competitor.partnerInfo != undefined && competitor.partnerInfo != null) {
                        row.partnerName = competitor.partnerInfo.name === null? '': competitor.partnerInfo.name;
                        row.partnerPhone = competitor.partnerInfo.phoneNumber === null ? '':competitor.partnerInfo.phoneNumber;
                        row.partnerBusinessNo = competitor.partnerInfo.bussinessNumber === null ? '':competitor.partnerInfo.bussinessNumber;
                    }
                    row.sellCount = competitor.sellCount;
                    row.sellCountGap = competitor.sellCountGap;
                    row.totalPoint = competitor.totalPoint;

                }

                this.bindedDataContents.push(row);


            });

        }
    }

    onLoadCategoryDepth(filter: ProductPriceComparisonFilter, curDepth: number, reqDepth: number, comCategoryNo: string): void {
        this.blockUI.start();
        this.productPriceService.onLoadCategoryDepth(filter, reqDepth, comCategoryNo).subscribe(serverResponse => {
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

    private onGetHistoryDetails(coId, productId): void {

        this.blockUI.start();

        this.productPriceService.onGetHistoryDetails(this.filter, coId, productId).subscribe(serverResponse => {
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
                this.productHistDetails =[];
                let coId: string = data.item.coId;
                let productId: string = data.item.dealId;

                this.onGetHistoryDetails(coId, productId);

            }

        }
    }
    resetPreviousCellClick(): void {
        this.subRows[this.previousCellActionIndex] = false;
    }

    handleShowCategoryDepth(type: CategoryDepthEnum): void {

        switch(type) {
            case CategoryDepthEnum.Depth1:{
                this.onLoadCategoryDepth(this.filter, 1, null, null);
                break;
            }
            case CategoryDepthEnum.Depth2: {
                if( this.filter.categoryDepth1 !=='') {
                    this.onLoadCategoryDepth(this.filter, 2, 1, this.filter.categoryDepth1);
                }
                break;
            }
            case CategoryDepthEnum.Depth3: {
                if( this.filter.categoryDepth2 !=='') {
                    this.onLoadCategoryDepth(this.filter, 3, 2, this.filter.categoryDepth2);
                }
                break;
            }
        }


    }

    handleCategoryChange(type: CategoryDepthEnum): void{
        switch(type) {
            case CategoryDepthEnum.Depth1:{
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

    getComponentUrl():string {
        return this.isAdminView ? '/admin/product-price-comparison' : '/product-price-comparison';
    }

    resetCategoryFilter(): void{
        this.categoryDepth1Items = [];
        this.categoryDepth2Items = [];
        this.categoryDepth3Items = [];
        this.filter.categoryDepth1 = "";
        this.filter.categoryDepth2 = "";
        this.filter.categoryDepth3 = "";
    }

    validateDealNameInput(){
        let errorElement: HTMLElement = document.getElementById('errorDealNameSp');
        if(this.filter.dealName !=='' && this.filter.dealName.length < 2){
            errorElement.setAttribute("style", "color:red; display:block");
            return false;
        }else
            errorElement.setAttribute("style", "display:none");
        return true;
    }


}
