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
import {NaverPriceComparisonService} from "../service/naver-price-comparision-service";
import {AppSettings} from "../../../../shared/models/app-settings";
import {
    BestDealComparisionDTO, BestDealComparisonFilter, BestDealsComparisionResponse
} from "../models/best-deals-comparision";
import {BestDealsComparisonService} from "../service/best-deals-comparision-service";
import {Observable, Observer} from "rxjs";
import {ProductHistoryDTO} from "../models/product-history-report";
import {ProductOptionsRowDetailsComponent} from "../../../product-best-options/product-options-row-details/product-options-row-details.component";
import {ProductRankValueComponent} from "../product-rank-value/product-rank-value.component";

@Component({
    selector: 'best-deals-comparison',
    templateUrl: './best-deals-comparision.component.html',
    styleUrls: ['./best-deals-comparision.component.css']
})

export class BestDealsComparisonComponent implements OnInit {


    pagination: Pagination = new Pagination(new PageRequest());

    constructor(private bestDealsService: BestDealsComparisonService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService) {

        this.pagination.pageRequest.reset();
        this.blockUI.vRef = this.viewContainerRef;
    }

    filter: BestDealComparisonFilter = new BestDealComparisonFilter();
    bestDealComparisionDTO: BestDealComparisionDTO = new BestDealComparisionDTO();
    bestDealResponseData: Map<number, Map<string, ProductHistoryDTO[]>> = new Map();
    bestDealBindedData: Map<string, ProductHistoryDTO[]>[] = [];
    bestDealPagging: Map<string, ProductHistoryDTO[]>[] = [];
    navSubscription: Subscription;
    queryParamsSubscription: Subscription;
    disableSearch: boolean = false;
    sellers = [
        { coId: 'tmn', name: 'TMN', settingsForShow: [{"fieldName":"rank-gap", "width": "100px", "align": "center", "type": "string"}, {"fieldName":"dealNo", "width": "100px", "align": "left", "type": "string"},
                {"fieldName": "category", "width": "120px", "align": "left", "type": "string"}, {"fieldName": "link", "width": "200px", "align": "left", "type": "string"}, {"fieldName": "price-gap", "width": "100px", "align": "left", "type": "string"}, {"fieldName": "countOfSale", "width": "100px", "align": "left", "type": "string"}, {"fieldName":"delivery-fee", "width": "100px", "align": "left", "type": "string"}] },
        { coId: 'wmp', name: 'WMP' , settingsForShow: [{"fieldName":"rank-gap", "width": "100px", "align": "center", "type": "string"}, {"fieldName":"dealNo", "width": "100px", "align": "left", "type": "string"},
                {"fieldName": "category", "width": "120px", "align": "left", "type": "string"}, {"fieldName": "link", "width": "200px", "align": "left", "type": "string"}, {"fieldName": "price-gap", "width": "100px", "align": "left", "type": "string"}, {"fieldName": "countOfSale", "width": "100px", "align": "left", "type": "string"}, {"fieldName":"delivery-fee", "width": "100px", "align": "left", "type": "string"}]  },
        { coId: 'gmrk', name: 'GMK' , settingsForShow: [{"fieldName":"rank-gap", "width": "100px", "align": "center", "type": "string"}, {"fieldName":"dealNo", "width": "100px", "align": "left", "type": "string"},
                {"fieldName": "category", "width": "120px", "align": "left", "type": "string"}, {"fieldName": "link", "width": "200px", "align": "left", "type": "string"}, {"fieldName": "price-gap", "width": "100px", "align": "left", "type": "string"}, {"fieldName": "countOfSale", "width": "100px", "align": "left", "type": "string"}, {"fieldName":"delivery-fee", "width": "100px", "align": "left", "type": "string"}] }
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

    bestDealDataSettings: object = {
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
        this.bestDealPagging = this.bestDealBindedData.slice(this.pagination.pageRequest.page*this.pagination.maxSize, this.pagination.pageRequest.page*this.pagination.maxSize + this.pagination.maxSize)
        //}
    }

    resetData() {
        this.bestDealBindedData = [];
        this.pagination = new Pagination(new PageRequest());
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
    }

    ngOnInit() {
        this.queryParamsSubscription = this.route.queryParams.subscribe(params=> {
            let role = window.localStorage.getItem("role");
            this.isAdminView = (params['isAdminView']==='true') && role ==='admin';
        });
        this.filter.isShowDealNo = true;
        this.filter.isShowCategory = true;
        let params = RouteUtils.extractParams(this.route, {});
        this.filter.bind(params);
        this.loadData();
        this.buildTableHeader();
    }
    loadData() {
        this.blockUI.start();
        this.bestDealsService.loadData(this.filter, this.pagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
                case 'OK': {
                    let response = serverResponse as BestDealsComparisionResponse;
                    if (response != null && response != undefined) {
                        let prodHisByRankJson = response.data.prodHisByRank;
                        let bestDealResponseData : Map<number, Map<string, ProductHistoryDTO[]>> = new Map();
                        Object.keys(prodHisByRankJson).sort(function(key1, key2) {
                            return Number(key2) - Number(key1);
                        }).forEach(function(rank) {
                            let prodMapByCoId = new Map();
                            Object.keys(prodHisByRankJson[rank]).forEach(function (coId) {
                                prodMapByCoId.set(coId, prodHisByRankJson[rank][coId]);
                            });
                            bestDealResponseData.set(Number(rank), prodMapByCoId);
                        });
                        this.bestDealResponseData = bestDealResponseData;

                        let listOfMapProdHisByCoId: Map<string, ProductHistoryDTO[]>[] = [];
                        let maxLength = 0;
                        this.sellers.forEach(seller => {
                            let prodHisByCoId: Map<string, ProductHistoryDTO[]> = new Map();
                            let prodHisDtos : ProductHistoryDTO[] = [];
                            this.bestDealResponseData.forEach(prodMapByCoId => {
                                if (prodMapByCoId.get(seller.coId)) {
                                    prodMapByCoId.get(seller.coId).forEach(prdHis => {
                                        prodHisDtos.push(prdHis);
                                    });
                                }
                            });
                            prodHisByCoId.set(seller.coId, prodHisDtos);
                            if (maxLength < prodHisByCoId.get(seller.coId).length) {
                                maxLength = prodHisByCoId.get(seller.coId).length;
                            }
                            listOfMapProdHisByCoId.push(prodHisByCoId);
                        });

                        for (var i = 0; i < maxLength; i++) {
                            let prodHisByRow: Map<string, ProductHistoryDTO[]> = new Map();
                            listOfMapProdHisByCoId.forEach(mapProdHisByCoId => {
                                this.sellers.forEach(seller => {
                                    if (mapProdHisByCoId.get(seller.coId)) {
                                        prodHisByRow.set(seller.coId, [mapProdHisByCoId.get(seller.coId)[i]]);
                                    }
                                });
                            });
                            this.bestDealBindedData.push(prodHisByRow);
                        }

                        this.bestDealPagging = this.bestDealBindedData.slice(this.pagination.pageRequest.page*this.pagination.maxSize, this.pagination.pageRequest.page*this.pagination.maxSize + this.pagination.maxSize);
                        this.pagination.totalItems = this.bestDealBindedData.length;
                    } else {
                        this.bestDealComparisionDTO = {};
                        this.bestDealComparisionDTO.prodHisByRank = new Map();
                        this.bestDealPagging = [];
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
            this.bestDealComparisionDTO = {};
            this.bestDealComparisionDTO.prodHisByRank = new Map();
            this.bestDealBindedData = [];
            this.bestDealPagging = [];
            this.loadData();
            this.buildTableHeader();
            this.filter.unbind();
        }
    }

    onReset(): void {
        this.filter = new BestDealComparisonFilter();
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        this.filter.unbind();
    }


    onExportExcel(): void {
        if(this.validateInput()) {
            this.bestDealsService.onExportDealsToExcel(this.filter, this.pagination.pageRequest);
        }
    }

    buildTableHeader(): void {
        let settingsProductSearch: object = {};
        settingsProductSearch['rank'] = {
            title: 'bestDealsComparision.column.rank',
            width: '100px',
            align: 'center',
            render: (data: { item: Map<string, ProductHistoryDTO[]>, value: any }, settings: object) => {
                return this.bestDealBindedData.findIndex(x => x === data.item)+1;
            }
        };
        this.sellers.forEach(seller => {
            seller.settingsForShow.forEach(setting => {
                if (!this.filter.isShowCategory && setting.fieldName === 'category') {
                    return;
                }
                if (!this.filter.isShowDealNo && setting.fieldName === 'dealNo') {
                    return;
                }
                if (seller.coId === 'gmrk' && setting.fieldName === 'countOfSale') {
                    return;
                }
                if (setting.fieldName === 'rank-gap') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] =
                        {
                            title: [seller.name, 'bestDealsComparision.column.' + setting.fieldName],
                            renderType:'cmp',
                            type: setting.type,
                            width: setting.width,
                            align: setting.align,
                            renderCmp: (data: { item: Map<string, ProductHistoryDTO[]>, value: any }, settings: object) => {
                                if (data && data.item && data.item.get(seller.coId) && data.item.get(seller.coId)[0] && data.item.get(seller.coId)[0] && data.item.get(seller.coId)[0]) {
                                    return {
                                        component: ProductRankValueComponent,
                                        inputs: {
                                            rank: data.item.get(seller.coId)[0].rank,
                                            rankGap: data.item.get(seller.coId)[0].rankGap,
                                        }
                                    }
                                }
                                return '';
                            }
                        };
                } else {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] =
                        {
                            title: [seller.name, 'bestDealsComparision.column.' + setting.fieldName],
                            type: setting.type,
                            width: setting.width,
                            align: setting.align,
                            render: (data: { item: Map<string, ProductHistoryDTO[]>, value: any }, settings: object) => {
                                if (data && data.item && data.item.get(seller.coId) && data.item.get(seller.coId)[0]) {
                                    if (setting.fieldName === 'dealNo') {
                                        return data.item.get(seller.coId)[0].productCode;
                                    } else if (setting.fieldName === 'category') {
                                        return data.item.get(seller.coId)[0].cat1Name + " > " + data.item.get(seller.coId)[0].cat2Name + " > " + data.item.get(seller.coId)[0].cat3Name;
                                    } else if (setting.fieldName === 'link') {
                                        if (seller.coId === 'tmn') {
                                            return `<a href=`+ 'http://www.ticketmonster.co.kr/deal/' + data.item.get(seller.coId)[0].productCode +`>` + data.item.get(seller.coId)[0].name + `</a>`
                                        }
                                        return `<a href=`+ data.item.get(seller.coId)[0].url +`>` + data.item.get(seller.coId)[0].name + `</a>`;
                                    } else if (setting.fieldName === 'price-gap') {
                                        let price = data.item.get(seller.coId)[0].priceNow;
                                        let priceGap = data.item.get(seller.coId)[0].priceGap;
                                        return `${formatNumber(price)}(${priceGap > 0 ? '+' + priceGap: priceGap})`;
                                    } else if (setting.fieldName === 'countOfSale') {
                                        return data.item.get(seller.coId)[0].sellCount;
                                    } else if (setting.fieldName === 'delivery-fee') {
                                        return data.item.get(seller.coId)[0].deliveryInfo;
                                    }
                                }
                                return '';
                            }
                        };
                }
            });
        });

        this.bestDealDataSettings = {
            table: this.bestDealDataSettings['table'],
            column: settingsProductSearch
        };

    }

    validateInput(){
        return true;
    }

}
