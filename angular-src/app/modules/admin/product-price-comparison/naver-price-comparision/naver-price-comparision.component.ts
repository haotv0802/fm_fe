import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogService} from "ng2-bootstrap-modal";
import {Subscription} from "rxjs/Subscription";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import RouteUtils from "../../../../shared/utils/RouteUtils";
import {Pagination} from "../../../../shared/models/pagination";
import {PageRequest} from "../../../../shared/models/page-request";
import {formatNumber, showErrorPopup} from "../../../../shared/utils";
import {BadRequestResponse} from "../../../../shared/models/bad-request-response";
import { IMyDpOptions, IMyDateModel } from 'mydatepicker'
import {Pipe} from '@angular/core';
import {
    CategoryDepthEnum,
} from "../models/product-history-report";
import {
    NaverCategoryDTO,
    NaverCategoryResponse,
    NaverPriceComparisionDTO,
    NaverPriceComparisionResponse, NaverPriceComparisionWithPagination,
    NaverPriceComparisonFilter
} from "../models/naver-price-comparision";
import {ProductPriceComparisonService} from "../service/product-price-comparison-service";
import {NaverPriceComparisonService} from "../service/naver-price-comparision-service";
import {NaverDeals, NaverDealsServerResponse} from "../../../naver-search/models/NaverDeals";
import {AppSettings} from "../../../../shared/models/app-settings";


const DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const PARSE_DATE_TIME_FORMAT = "YYYY-MM-DD";

@Component({
    selector: 'naver-price-comparison',
    templateUrl: './naver-price-comparision.component.html',
    styleUrls: ['./naver-price-comparision.component.css']
})

export class NaverPriceComparisonComponent implements OnInit {


    pagination: Pagination = new Pagination(new PageRequest());
    formChanged: boolean = false;

    constructor(private naverPriceService: NaverPriceComparisonService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService) {

        this.pagination.pageRequest.reset();
        this.blockUI.vRef = this.viewContainerRef;
    }

    filter: NaverPriceComparisonFilter = new NaverPriceComparisonFilter();
    navSubscription: Subscription;
    queryParamsSubscription: Subscription;

    naverBindedDataProduct : NaverPriceComparisionDTO[] = [];
    naverBindedDataBranch: string[][] = [];
    naverBindedDataTopSearch: string[][] = [];
    naverTopSearch: boolean = false;
    naverBranchSearch: boolean = false;
    naverTmonMatching: boolean = false;

    myDatePickerOptions: IMyDpOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    lineNo: number = 0;
    lastCrawlingMessage: string = "";
    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
        if(this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe()
        }
    }

    subRows: object = {};
    previousCellActionIndex: number = -1;

    naverDataSettingsProduct: object = {
        table: {
            //width: '2250px',
            translate: true,
            tableScroll: true,
            tableScrollHeight: '500px'
        }
    };

    isAdminView:boolean= false;
    categories: NaverCategoryDTO[] = [];
    categoryDepth1Items: string[] = [];
    categoryDepth2Items: string[] = [];
    isClickedPaging: boolean = false;

    onPaginationChanged(event: any): void {
        //if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
        let pageNumReq: number = event.page - 1;
        this.pagination.pageRequest.page = pageNumReq;
        this.lineNo = (event.page -1)* event.itemsPerPage;
        this.isClickedPaging = true;
        this.onSearch();
        //}
    }

    ngOnInit() {
        this.queryParamsSubscription = this.route.queryParams.subscribe(params=> {
            let role = window.localStorage.getItem("role");
            this.isAdminView = (params['isAdminView']==='true') && role ==='admin';
        });
        let params = RouteUtils.extractParams(this.route, {});
        this.filter.bind(params);
        this.handleShowCategoryDepth(1);
        this.getLastCrawlingDate();
        this.buildTableHeader();
    }
    getLastCrawlingDate() {
        this.naverPriceService.getLastCrawlingDate().subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    break;
                }
                case 'OK': {
                    if (serverResponse != null && serverResponse != undefined) {
                        this.lastCrawlingMessage = serverResponse.data;
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }, error => {
            console.log('error onSearchDeals', error);
        });
    }
    loadProducts() {
        if (this.filter.cat1 != null && this.filter.cat1 != undefined && this.filter.cat1 != '') {
            this.blockUI.start();
            this.naverPriceService.loadProducts(this.filter, this.pagination.pageRequest, this.naverTmonMatching).subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.isClickedPaging = false;
                        this.blockUI.stop();
                        break;
                    }
                    case 'OK': {
                        let response = serverResponse as NaverPriceComparisionWithPagination;
                        if (response != null && response != undefined) {
                            this.naverBindedDataProduct = response.data;
                            this.pagination.totalItems = response.pagination.total;
                        } else {
                            this.naverBindedDataProduct = [];
                        }
                        this.isClickedPaging = false;
                        this.isClickedPaging = false;
                        this.blockUI.stop();
                        break;
                    }
                    default: {
                        this.isClickedPaging = false;
                        this.blockUI.stop();
                        break;
                    }
                }
            }, error => {
                this.isClickedPaging = false;
                this.blockUI.stop();
                console.log('error onSearchDeals', error);
            });
        }
    }

    loadKeywordAndBranch() {
        if (this.naverTopSearch) {
            this.naverBindedDataTopSearch[0] = ['','','','','','','','','',''];
            this.naverBindedDataTopSearch[1] = ['','','','','','','','','',''];
            this.blockUI.start();
            this.naverPriceService.loadKeywordOrBranch(this.filter, 'N').subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.blockUI.stop();
                        break;
                    }
                    case 'OK': {
                        if (serverResponse != null && serverResponse != undefined && serverResponse.data != null && serverResponse.data != undefined) {
                            this.naverBindedDataTopSearch[0] = ['','','','','','','','','',''];
                            this.naverBindedDataTopSearch[1] = ['','','','','','','','','',''];
                            if (serverResponse.data.length > 0) {
                                let halfSize = Math.floor(serverResponse.data.length/2);
                                this.naverBindedDataTopSearch[0] = serverResponse.data.slice(0, halfSize);
                                this.naverBindedDataTopSearch[1] = serverResponse.data.slice(halfSize, serverResponse.data.length);
                            } else {
                                this.naverBindedDataTopSearch[0] = ['','','','','','','','','',''];
                                this.naverBindedDataTopSearch[1] = ['','','','','','','','','',''];
                            }
                        }
                        this.blockUI.stop();
                        break;
                    }
                    default: {
                        this.blockUI.stop();
                        break;
                    }
                }
            }, error => {
                this.blockUI.stop();
                console.log('error onSearchDeals', error);
            });
        }
        if (this.naverBranchSearch) {
            this.naverBindedDataBranch[0] = ['','','','','','','','','',''];
            this.naverBindedDataBranch[1] = ['','','','','','','','','',''];
            this.blockUI.start();
            this.naverPriceService.loadKeywordOrBranch(this.filter, 'Y').subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.blockUI.stop();
                        break;
                    }
                    case 'OK': {
                        if (serverResponse != null && serverResponse != undefined && serverResponse.data != null && serverResponse.data != undefined) {
                            this.naverBindedDataBranch[0] = ['','','','','','','','','',''];
                            this.naverBindedDataBranch[1] = ['','','','','','','','','',''];
                            if (serverResponse.data.length > 0) {
                                let halfSize = Math.floor(serverResponse.data.length/2);
                                this.naverBindedDataBranch[0] = serverResponse.data.slice(0, halfSize);
                                this.naverBindedDataBranch[1] = serverResponse.data.slice(halfSize, serverResponse.data.length);
                            } else {
                                this.naverBindedDataBranch[0] = ['','','','','','','','','',''];
                                this.naverBindedDataBranch[1] = ['','','','','','','','','',''];
                            }
                        }
                        this.blockUI.stop();
                        break;
                    }
                    default: {
                        this.blockUI.stop();
                        break;
                    }
                }
            }, error => {
                this.blockUI.stop();
                console.log('error onSearchDeals', error);
            });
        }
    }


    onSearch(): void {
        if (!this.isClickedPaging) {
            this.pagination.pageRequest.reset();
        }
        if(this.validateInput()) {
            this.naverBindedDataProduct = [];
            this.loadProducts();
            this.buildTableHeader();
            this.filter.unbind();
        }
    }

    onReset(): void {
        this.filter = new NaverPriceComparisonFilter();
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        this.filter.unbind();
    }


    onExportExcel(): void {
        if(this.validateInput()) {
            this.naverPriceService.onExportDealsToExcel(this.filter);
        }
    }

    buildTableHeader(): void {

        let settingsProductSearch: object = {};

        settingsProductSearch['categoryPath'] = {
            title: ['naverComparision.categoryPath'],
            width: '200px',
            align: 'left',
            render: (data: { value: any, item: object }, settings: object) => {
                let cat1 = (data.item['cat1'] != null && data.item['cat1'] != undefined) ? data.item['cat1'] : '';
                let cat2 = (data.item['cat2'] != null && data.item['cat2'] != undefined) ? data.item['cat2'] : '';
                return `${cat1 + " > " + cat2}`;
            }

        };

        settingsProductSearch['rank'] = {
            title: ['naverComparision.rank'],
            width: '80px',
            align: 'center',
            render: (data: { value: any, item: object }, settings: object) =>{
                return (data.item['productRank'] != null && data.item['productRank'] != undefined) ? data.item['productRank'] : 0;
            }
        };
        settingsProductSearch['seller1'] = {
            title: ['naverComparision.sellerName'],
            width: '150px',
            align: 'left',
            render: (data: { value: any, item: object }, settings: object) =>{
                return (data.item['seller1'] != null && data.item['seller1'] != undefined) ? data.item['seller1'] : '';
            }
        };
        settingsProductSearch['mainUrl1'] = {
            title: ['naverComparision.link'],
            width: '237px',
            align: 'left',
            render : (data:  { value: any, item: object }, settings: object) => {
                return (data.item['mainUrl1'] != null && data.item['mainUrl1'] != undefined) ? '<a href="' + data.item['mainUrl1'] + '" target="_blank">' + data.item['naverTitle'].toString() + '</a>' : '';
            }
        };
        settingsProductSearch['price1'] = {
            title: ['naverComparision.price'],
            width: '100px',
            align: 'right',
            render: (data: { value: any, item: object }, settings: object) => {
                return (data.item['price1'] != null && data.item['price1'] != undefined) ? `${formatNumber(data.item['price1'])}` : 0;
            }
        };


        settingsProductSearch['deliveryFee1'] = {
            title: ['naverComparision.deliveryInfo'],
            width: '100px',
            align: 'right',
            render: (data: { value: any, item: object }, settings: object) => {
                return (data.item['deliveryFee1'] != null && data.item['deliveryFee1'] != undefined) ? data.item['deliveryFee1'] : '';
            }
        };
        settingsProductSearch['tmonMatching'] = {
            title: ['naverComparision.tmonMatching'],
            width: '237px',
            background: 'yellow',
            align: 'left',
            render: (data: { value: any, item: object }, settings: object) => {
                return (data.item['mainUrl2'] != null && data.item['mainUrl2'] != undefined) ? '<a href="' + data.item['mainUrl2'] + '" target="_blank">' + data.item['title2'].toString() + '</a>' : '';
            }
        };
        settingsProductSearch['tmonRank'] = {
            title: ['naverComparision.tmonRank'],
            width: '80px',
            background: 'yellow',
            align: 'center',
            render: (data: { value: any, item: object }, settings: object) => {
                return (data.item['position2'] != null && data.item['position2'] != undefined) ? data.item['position2'] : '';
            }
        };
        settingsProductSearch['tmonPrice'] = {
            title: ['naverComparision.tmonPrice'],
            width: '150px',
            background: 'yellow',
            align: 'right',
            render: (data: { value: any, item: object }, settings: object) => {
                return (data.item['price2'] != null && data.item['price2'] != undefined) ? `${formatNumber(data.item['price2'])}` : '';
            }
        };
        settingsProductSearch['tmonDelivery'] = {
            title: ['naverComparision.tmonDelivery'],
            width: '150px',
            background: 'yellow',
            align: 'right',
            render: (data: { value: any, item: object }, settings: object) => {
                return (data.item['deliveryFee2'] != null && data.item['deliveryFee2'] != undefined) ? data.item['deliveryFee2'] : '';
            }
        };


        this.naverDataSettingsProduct = {
            table: this.naverDataSettingsProduct['table'],
            column: settingsProductSearch
        };

    }

    onLoadCategoryDepth(filter: NaverPriceComparisonFilter): void {
        this.blockUI.start();
        this.naverPriceService.onLoadCategoryDepth(filter).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                }
                case 'OK': {
                    if (serverResponse == null || serverResponse == undefined || serverResponse.data == null || serverResponse.data == undefined) {
                        this.categoryDepth1Items = [];
                        this.categoryDepth2Items = [];
                    }
                    let response = serverResponse as NaverCategoryResponse;
                    this.categories = response.data;
                    this.categoryDepth1Items = this.categories.filter((naverCategoryDto: NaverCategoryDTO) => {
                        return (naverCategoryDto != null && naverCategoryDto != undefined && naverCategoryDto.cat1StrUnmapped != null
                            && naverCategoryDto.cat1StrUnmapped != undefined && naverCategoryDto.cat1StrUnmapped != ''
                            && naverCategoryDto.cat1StrUnmapped.replace(/\s/g, '') != '')
                    }).map((naverCategoryDto: NaverCategoryDTO) => {
                       return naverCategoryDto.cat1StrUnmapped;
                    });
                    this.blockUI.stop();
                }
            }
        }, error => {
            console.log('error onLoadCategoryDepth', error);
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
            this.blockUI.stop();
        });

    }

    handleTableChange({action, data, event}) {
        if (action == 'cellclick') {
            let rowIndex = data.rowIndex;
            this.subRows[rowIndex] = !this.subRows[rowIndex];
        }
    }

    validateInput(){
        let errorElement: HTMLElement = document.getElementById('errorInput');
        if(this.filter.searchDate == null || this.filter.searchDate == undefined ||
            this.filter.cat1 == null || this.filter.cat1 == undefined || this.filter.cat1 ===''){
            errorElement.setAttribute("style", "color:red; display:block");
            return false;
        }else
            errorElement.setAttribute("style", "display:none");
        return true;
    }

    handleShowCategoryDepth(selectedId: number): void {
        if (selectedId == 1) {
            this.categoryDepth1Items = [];
            this.filter.cat1 = '';
            this.filter.cat2 = '';
            this.onLoadCategoryDepth(this.filter);
        } else {
            this.categoryDepth2Items = [];
            this.filter.cat2 = '';
            let cateDto: NaverCategoryDTO = this.categories.filter((naverCategoryDTO: NaverCategoryDTO) => {
                return naverCategoryDTO.cat1StrUnmapped === this.filter.cat1
            })[0];
            this.categoryDepth2Items = (cateDto != null && cateDto != undefined && cateDto.cat2StrUnmapped != null && cateDto.cat2StrUnmapped != undefined) ? cateDto.cat2StrUnmapped.filter((cat2: string) => {
                return (cat2 != null && cat2 != undefined && cat2.replace(/\s/g, '') != '');
            }) : [];
        }
    }

    handleStartDateChange(event: IMyDateModel) {
        this.filter.searchDate = event;
        this.handleShowCategoryDepth(1);
        this.categoryDepth2Items = [];
    }

}
