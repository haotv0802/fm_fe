import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogService} from "ng2-bootstrap-modal";
import {Subscription} from "rxjs/Subscription";
import {BlockUIService} from "../../shared/services/block-ui.service";
import {Pagination} from "../../shared/models/pagination";
import {PageRequest} from "../../shared/models/page-request";
import RouteUtils from "../../shared/utils/RouteUtils";
import {formatNumber, showErrorPopup} from "../../shared/utils/index";
import {NaverSearchService} from "./service/naver-search-service";
import {NaverDeals, NaverDealsServerResponse} from "./models/NaverDeals";
import {BadRequestResponse} from "../../shared/models/bad-request-response";
import {Observable} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {AppSettings} from "../../shared/models/app-settings";
import * as moment from 'moment';
import {NotificationDialogComponent} from "../admin/notification/dialog/notification-dialog.component";
import {NotificationService} from "../admin/notification/service/notification-service";
import {CookieService} from "ngx-cookie";
import {Notification} from "../admin/notification/models/Notification";
import {AuthGuard} from "../../shared/services/auth.service";
import {NaverFilter} from "./models/naver-filter";
import {
    NaverCategoryDTO, NaverCategoryResponse,
    NaverPriceComparisonFilter
} from "../admin/product-price-comparison/models/naver-price-comparision";
import {NaverPriceComparisonService} from "../admin/product-price-comparison/service/naver-price-comparision-service";

const NAVER_SEARCH_URL = '/api/getNaverDealsByKeywords';
const PAGE_ID = "NAVER_SEARCH";

@Component({
    selector: 'app-naver-search',
    templateUrl: './naver-search.component.html',
    styleUrls: ['./naver-search.component.css']
})


export class NaverSearchComponent implements OnInit {

    constructor(private naverSearchService: NaverSearchService,
                private notificationService: NotificationService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService,
                private authGuard: AuthGuard,
                private naverPriceService: NaverPriceComparisonService,
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
        this.onLoadCategoryDepth(this.filter);
    }
    keywords: string;
    isFinishedSearchDeals: boolean;
    disableBtn: boolean = false;
    navSubscription: Subscription;
    queryParamsSubscription: Subscription;
    timer: Observable<number>;
    subTimer: Subscription;
    filter: NaverFilter = new NaverFilter();
    categoryDepth1Items: string[] = [];
    categoryDepth2Items: string[] = [];
    categoryDepth2Code: string[] = [];
    categories: NaverCategoryDTO[] = [];

    dataSettings: object = {
        table: {
            translate: true,
            tableScroll: true,
            tableScrollHeight: '600px'
        }
    };


    lineNo: number = 0;
    bindedDataContents: NaverDeals[] = [];

    allItems: NaverDeals[] = [];

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe()
        }
    }

    pagination: Pagination = new Pagination(new PageRequest());

    removeDuplicatedRank: boolean = true;
    exposeMainDeal: boolean = false;

    handleShowCategoryDepth(selectedId: number, category: string): void {
        if (this.filter['category1'] === category) {
            this.filter['category1'] = '';
        } else {
            this.filter['category1'] = category;
        }
        if (selectedId == 1) {
            this.categoryDepth1Items = [];
            this.filter.category1 = '';
            this.filter.category2 = '';
            this.onLoadCategoryDepth(this.filter);
        } else {
            this.categoryDepth2Items = [];
            this.filter.category2 = '';
            let cateDto: NaverCategoryDTO = this.categories.filter((naverCategoryDTO: NaverCategoryDTO) => {
                return naverCategoryDTO.cat1StrUnmapped === this.filter.category1
            })[0];
            this.categoryDepth2Items = (cateDto != null && cateDto != undefined && cateDto.cat2StrUnmapped != null && cateDto.cat2StrUnmapped != undefined) ? cateDto.cat2StrUnmapped.filter((cat2: string) => {
                return (cat2 != null && cat2 != undefined && cat2.replace(/\s/g, '') != '');
            }) : [];
            this.categoryDepth2Code = (cateDto != null && cateDto != undefined && cateDto.cat2CodeUnmapped != null && cateDto.cat2CodeUnmapped != undefined) ? cateDto.cat2CodeUnmapped.filter((cat2: string) => {
                return (cat2 != null && cat2 != undefined && cat2.replace(/\s/g, '') != '');
            }) : [];
            this.filter['categoryId'] = cateDto != null ? cateDto.cat1CodeUnmapped : '';
        }
    }

    onSelectCat2(index: number) {
        this.filter['category2'] = this.categoryDepth2Items[index];
        this.filter['categoryId'] = this.categoryDepth2Code[index];
    }

    onLoadCategoryDepth(filter: NaverFilter): void {
        this.blockUI.start();
        this.naverPriceService.onLoadCategoryDepthForNaver(filter).subscribe(serverResponse => {
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
                    this.filter['category2'] = '';
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

    onPaginationChanged(event: any): void {
        this.bindedDataContents = [];
        let pageNumReq: number = event.page - 1;
        this.pagination.pageRequest.page = pageNumReq;
        this.lineNo = (event.page - 1) * event.itemsPerPage;
        this.bindedDataContents = this.allItems.slice(pageNumReq * AppSettings.MAX_SIZE_VISIBLE , pageNumReq * AppSettings.MAX_SIZE_VISIBLE + AppSettings.MAX_SIZE_VISIBLE)
    }

    ngOnInit() {
        this.isFinishedSearchDeals = false;
        this.buildTableHeader();

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
    }

    onSearch(): void {
        if (this.keywords == undefined || this.keywords == null || this.keywords === '') {
            this.translateService.get('naverSearch.errorMessage.3002').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
            return;
        }

        if (this.filter.priceFrom && !this.filter.priceTo) {
            this.translateService.get('naverSearch.errorMessage.3003').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
            return;
        }
        this.disableBtn = true;
        this.allItems = [];
        this.isFinishedSearchDeals = false;
        this.resetData();
        this.buildTableHeader();
        this.onTriggerCrawling(this.keywords, window.localStorage.getItem("username"),
            this.filter.keyword, this.filter.categoryId, this.filter.priceFrom, this.filter.priceTo);
    }

    resetData() {
        this.bindedDataContents = [];
        this.pagination = new Pagination(new PageRequest());
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
    }

    onReset(): void {
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        RouteUtils.navigateTo(this.router, NAVER_SEARCH_URL, /*this.filter.unbind()*/ null);
    }

    onExportExcel(sessionId: string): void {
        this.naverSearchService.onExportDealsToExcel(sessionId);
    }

    buildTableHeader(): void {

        let settings: object = {};

        settings['keyword'] = {
            title: ['naverSearch.keyword'],
            width: '100px',
            align: 'left',
            render: (data: { value: any, item: object }, settings: object) => {
                return data.item['keyword'] != null ? `${decodeURIComponent(data.item['keyword'])}` : null;
            }
        };

        settings['countOfResult'] = {
            title: ['naverSearch.countOfResult'],
            width: '100px',
            align: 'center'
        };

        settings['resultRank'] = {
            title: ['naverSearch.resultRank'],
            width: '110px',
            align: 'center'
        };

        settings['seller1'] = {
            title: ['naverSearch.seller1'],
            width: '150px',
        };

        settings['title'] = {
            title: ['naverSearch.title'],
            width: '200px',
        };

        settings['minPrice'] = {
            title: ['naverSearch.minPrice'],
            width: '80px',
            align: 'center',
            render: (data: { value: any, item: object }, settings: object) => {
                return data.item['minPrice'] != null ? `${formatNumber(data.item['minPrice'])}` : null;
            }
        };

        settings['maxPrice'] = {
            title: ['naverSearch.maxPrice'],
            width: '80px',
            align: 'center',
            render: (data: { value: any, item: object }, settings: object) => {
                return data.item['maxPrice'] != null ? `${formatNumber(data.item['maxPrice'])}` : null;
            }
        };

        settings['tag'] = {
            title: ['naverSearch.tag'],
            width: '80px',
            align: 'left'
        };

        settings['countTag'] = {
            title: ['naverSearch.countTag'],
            width: '80px',
            align: 'center'
        };

        settings['deliveryFee'] = {
            title: ['naverSearch.deliveryFee'],
            width: '80px',
            align: 'center'
        };

        settings['startdate'] = {
            title: ['naverSearch.startdate'],
            width: '80px',
            align: 'center',
            render: (data: { value: any, item: object }, settings: object) => {
                return data.item['startdate'] != null ? `${moment(data.item['startdate']).format('YYYY.MM')}` : null;
            }
        };

        settings['categoryPath'] = {
            title: ['naverSearch.category'],
            width: '150px',
            align: 'left'
        };

        settings['discountInfo'] = {
            title: ['naverSearch.discountInfo'],
            width: '250px',
            align: 'left'
        };

        settings['mainUrl'] = {
            title: ['naverSearch.mainUrl'],
            width: '250px',
            align: 'left',
            render: (data: { value: any, item: object }, settings: object) => {
                return data.item['mainUrl'] != undefined ?  '<a href="' + data.item['mainUrl'] + '" target="_blank">' + (data.value != undefined ? data.value.toString().substr(0, 40) + '...' : undefined) + '</a>' : undefined;
            }
        };

        this.dataSettings = {
            table: this.dataSettings['table'],
            column: settings,
            row: {
            }
        };
    }

    onTriggerCrawling(keywords: string, sessionId: string, preKeyword: string, cateId: string, minPrice: string, maxPrice: string) : void {
        if (keywords != undefined) {
            this.naverSearchService.onTriggerCrawling(this.pagination.pageRequest, keywords.replace(/\n/g, ','), sessionId, preKeyword, cateId, minPrice, maxPrice).subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.isFinishedSearchDeals = true;
                        this.translateService.get('naverSearch.errorMessage.' + badRequestResponse.exceptionCode).subscribe(msg => {
                            showErrorPopup(this.dialogService, this.translateService, msg);
                        });
                        this.disableBtn = false;
                        break;
                    }
                    case 'OK': {
                        this.timer = TimerObservable.create(0, 3000);
                        this.subTimer = this.timer.subscribe(num => this.onSearchDeals(sessionId),undefined,() => console.log("completed"));
                        break;
                    }
                    default: {
                        this.isFinishedSearchDeals = true;
                        this.disableBtn = false;
                        break;
                    }
                }
            }, error => {
                console.log('error onTriggerCrawling', error);
                this.isFinishedSearchDeals = true;
                this.disableBtn = false;
                this.translateService.get('message.err_unknown').subscribe(msg => {
                    showErrorPopup(this.dialogService, this.translateService, msg);
                });
            });
        }
    }

    onSearchDeals(sessionId: string) : void {
        this.naverSearchService.onSearchDeals(this.allItems.length, this.pagination.pageRequest.size, sessionId).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.isFinishedSearchDeals = true;
                    this.translateService.get('naverSearch.errorMessage.' + badRequestResponse.exceptionCode).subscribe(msg => {
                        showErrorPopup(this.dialogService, this.translateService, msg);
                    });
                    this.disableBtn = false;
                    this.subTimer.unsubscribe();
                    break;
                }
                case 'OK': {
                    let response = serverResponse as NaverDealsServerResponse;
                    if (response != null && response.data != null) {
                        if (response.data.searchFinish && response.data.totalDeals === 0) {
                            this.isFinishedSearchDeals = true;
                            this.disableBtn = false;
                            this.subTimer.unsubscribe();
                            return;
                        }
                        var resp: NaverDeals[] = response.data.naverDealDtos;
                        if (resp != undefined && resp != null) {
                            for (var i = 0; i<= resp.length-1; i++) {
                                this.allItems.push(resp[i]);
                            }
                        }
                        var groups = this.allItems.reduce(function(obj,item){
                            obj[item.keyword] = obj[item.keyword] || [];
                            obj[item.keyword].push(item);
                            return obj;
                        }, {});
                        var arrays = Object.keys(groups).map(function(key){
                            return groups[key].sort(function(a, b){
                                return a.resultRank - b.resultRank;
                            });
                        });
                        this.allItems = [];
                        for (var i = 0; i<= arrays.length-1; i++) {
                            for (var j = 0; j<= arrays[i].length-1; j++) {
                                this.allItems.push(arrays[i][j]);
                            }
                        }
                        this.bindedDataContents = [];
                        this.bindedDataContents = this.allItems.slice(0, AppSettings.MAX_SIZE_VISIBLE);

                        if (resp != undefined && resp != null) {
                            this.pagination.totalItems += resp.length;
                        }
                        if (response.data.searchFinish && this.allItems.length === response.data.totalDeals) {
                            this.isFinishedSearchDeals = true;
                            this.disableBtn = false;
                            this.subTimer.unsubscribe();
                            this.onExportExcel(window.localStorage.getItem("username"));
                        }
                    }
                    break;
                }
                default: {
                    this.isFinishedSearchDeals = true;
                    this.disableBtn = false;
                    this.subTimer.unsubscribe();
                    break;
                }
            }
        }, error => {
            console.log('error onSearchDeals', error);
            this.isFinishedSearchDeals = true;
            this.disableBtn = false;
            this.subTimer.unsubscribe();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
    }

}
