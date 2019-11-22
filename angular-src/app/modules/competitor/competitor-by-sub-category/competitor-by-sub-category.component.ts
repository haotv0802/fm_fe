import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
    CategorySummaryPerCompetitor, CategorySummaryPerDateUnit,
    CompetitorByCategoryResponse, SummaryByCompetitor, TimeValue, TotalCompetitorByCategoryResponse,
    SummaryByCategory, SumAllSalesResponse, SummaryTotalSales,
    ForecastSalesResponse, ForecastSales, SummaryCategoryType,
    CompetitorByCategoryFilter, ContentsAtCompetitorView, ContentsAtCatgeoryView
} from "../models/competitor-by-category";
import {CompetitorService} from "../services/competitor-service";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {BaseModel} from "../../../shared/models/base-model";
import {IMyDateModel} from 'mydatepicker';
import {createIMyDateModel, getFirstDateOfMonth, getLastDateOfMonth} from "../../../shared/utils";
import {LanguageService} from "../../../shared/services/language.service";
import {DialogService} from 'ng2-bootstrap-modal';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {PageRequest} from "../../../shared/models/page-request";
import {Pagination} from "../../../shared/models/pagination";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import * as _ from 'lodash';
import RouteUtils from "../../../shared/utils/RouteUtils";
import { forkJoin } from "rxjs/observable/forkJoin";
import * as moment from 'moment';
const CURRENT_URL = '/competitor-by-sub-category';


@Component({
    templateUrl: './competitor-by-sub-category.component.html',
    styleUrls: ['./competitor-by-sub-category.component.css']
})
export class CompetitorBySubCategoryComponent implements OnInit {

    constructor(private competitorService: CompetitorService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private languageService : LanguageService) {
        this.languageService.getLanguage();
        this.blockUI.vRef = this.viewContainerRef;
        this.router.events.subscribe((val) => {
            var contextRoot = val["url"];
            if(!contextRoot.startsWith(CURRENT_URL))
                return;
            if (val instanceof NavigationEnd) {
                let params = RouteUtils.extractParams(this.route, {});
                if(contextRoot != CURRENT_URL){
                    this.competitorByCategoryFilter.bind(params);
                }

            }
        });
    }

    competitorByCategoryFilter:CompetitorByCategoryFilter = new CompetitorByCategoryFilter();

    cat1: Array<number> = [];
    cat2: Array<number> = [];

    pagination: Pagination = new Pagination(new PageRequest);
    viewMode: string = 'competitor';

    dataContents: object[];

    contentsAsCompetitorView: ContentsAtCompetitorView = new ContentsAtCompetitorView();
    contentsAsCategoryView: ContentsAtCatgeoryView= new ContentsAtCatgeoryView();

    dataSettings: object  = {
        table: {
            width: '2000px'
        }
    };

    competitors = [
        { coId:'tmn', selected:true, name: 'TMN'},
        { coId:'wmp', selected:true, name: 'WMP'}
    ];
    cat1Depths =[
        { key: 0, label: '기타'},
        { key: 4, label: '지역'},
        { key: 8, label: '전국' },
        { key: 12, label: '투어'},
        { key: 20, label: '컬쳐'},
        { key: 130, label: '쇼핑' },
        { key: 134, label: '패션' }
    ];

    cat2Depths = [
        { key: 88, label: '레저/리조트' },
        { key: 92, label: '호텔' },
        { key: 96, label: '숙박' },
        { key: 100, label: '국내여행' },
        { key: 104, label: '해외여행' },
        { key: 108, label: '제주여행' },
        { key: 112, label: '뮤지컬' },
        { key: 116, label: '연극' },
        { key: 120, label: '콘서트' },
        { key: 124, label: '클래식' },
        { key: 128, label: '전시/체험' },
        { key: 142, label: '컬쳐 기타' },
        { key: 36, label: '식품' },
        { key: 44, label: '가전' },
        { key: 56, label: '뷰티' },
        { key: 60, label: '생활' },
        { key: 64, label: '육아' },
        { key: 76, label: '홈데코' },
        { key: 138, label: '도서/교육' },
        { key: 52, label: '패션의류' },
        { key: 68, label: '패션잡화' },
        { key: 72, label: '스포츠/레저' }

    ];


    handleClickCat1Depth(event) {
        this.parseBtnFilterValue(this.cat1, event);
    }

    handleClickCat2Depth(event) {
        this.parseBtnFilterValue(this.cat2, event);
    }
    updateCompetitorCheckedOptions(comp, event) {
        if(event.target.checked) {
            comp.selected = true;
        } else {
            comp.selected = false;
        }
    }
    parseBtnFilterValue(cat : Array<string|number>, event) : void {
        if(event.selected){
            cat.push(event.key);
        }
        else {
            const index: number = cat.indexOf(event.key);
            if (index !== -1) {
                cat.splice(index, 1);
            }
        }

    }
    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pagination.pageRequest.page = event.page - 1;
            this.onFilterSummaryByCategory();
        }
    }

    ngOnInit() {

    }

    onSearch(): void {
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.competitorByCategoryFilter.unbind());

        this.pagination.pageRequest.reset();

        this.collectFilterParams();
        this.buildTableHeader();

        this.onSearchCallApi();


    }
    onReset(): void {
        this.competitorByCategoryFilter = new CompetitorByCategoryFilter();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.competitorByCategoryFilter.unbind());
    }

    onChangeViewMode(event:any): void {
        this.buildTableHeader();
        this.collectFilterParams();
        //decrease one page to make it re-load current page
        /*if(this.pagination.pageRequest.page > 0) {
            this.pagination.pageRequest.page = this.pagination.pageRequest.page -1;
        }*/
        this.refreshContents();
    }
    onSearchCallApi() {
        this.blockUI.start();
        let total = this.competitorService.getTotalSummaryByCategory(this.competitorByCategoryFilter, SummaryCategoryType.Leaf);
        let summaries = this.competitorService.getSummaryByCategory(this.competitorByCategoryFilter, SummaryCategoryType.Leaf, this.pagination.pageRequest);
        let sumSales = this.competitorService.getSumAllSales(this.competitorByCategoryFilter, SummaryCategoryType.Leaf);

        const isForecast = this.isDisplayForecast();

        if(isForecast) {
            let forecastSales = this.competitorService.getForecastSales(this.competitorByCategoryFilter, SummaryCategoryType.Leaf);
            forkJoin(total, summaries, sumSales, forecastSales).subscribe(results => {
                this.pagination.totalItems = (results[0] as TotalCompetitorByCategoryResponse).data;
                this.storeResponseAtViewMode(results[1] as CompetitorByCategoryResponse, results[2] as SumAllSalesResponse, results[3] as ForecastSalesResponse);
                this.refreshContents();
                this.blockUI.stop();
            }, error => {
                this.blockUI.stop();
            });
        } else {
            forkJoin(total, summaries, sumSales).subscribe(results => {
                this.pagination.totalItems = (results[0] as TotalCompetitorByCategoryResponse).data;
                this.storeResponseAtViewMode(results[1] as CompetitorByCategoryResponse, results[2] as SumAllSalesResponse);
                this.refreshContents()
                this.blockUI.stop();
            }, error => {
                this.blockUI.stop();
            })
        }
    }
    storeResponseAtViewMode(competitorByCategoryResponse: CompetitorByCategoryResponse,
                            sumAllSalesResponse?: SumAllSalesResponse,
                            forecastSalesResponse?:ForecastSalesResponse) {

        this.contentsAsCompetitorView.contents = this.transformSummaries(competitorByCategoryResponse, 'competitor');
        this.contentsAsCategoryView.contents = this.transformSummaries(competitorByCategoryResponse, 'category');
        if(sumAllSalesResponse != undefined) {
            this.contentsAsCompetitorView.sumSales = this.transformSumSales(sumAllSalesResponse, 'competitor');
            this.contentsAsCategoryView.sumSales = this.transformSumSales(sumAllSalesResponse, 'category');
        }
        if(forecastSalesResponse != undefined) {
            this.contentsAsCompetitorView.forecastSales = this.transformForecastSales(forecastSalesResponse, 'competitor');
            this.contentsAsCategoryView.forecastSales = this.transformForecastSales(forecastSalesResponse, 'category');
        }
    }

    refreshContents() {
        this.dataContents = [];
        if(this.viewMode === 'competitor') {
            this.dataContents = Object.assign([], this.contentsAsCompetitorView.contents);
            if(!_.isEmpty(this.contentsAsCompetitorView.sumSales)) {
                this.dataContents.push(this.contentsAsCompetitorView.sumSales);
            }
            if(this.isDisplayForecast() && !_.isEmpty(this.contentsAsCompetitorView.forecastSales)) {
                this.dataContents.push(this.contentsAsCompetitorView.forecastSales);
            }
        } else {
            this.dataContents = Object.assign([],this.contentsAsCategoryView.contents);
            if(!_.isEmpty(this.contentsAsCategoryView.sumSales)) {
                this.dataContents.push(this.contentsAsCategoryView.sumSales);
            }
            if(this.isDisplayForecast() && !_.isEmpty(this.contentsAsCategoryView.forecastSales)) {
                this.dataContents.push(this.contentsAsCategoryView.forecastSales);
            }
        }

    }
    buildTableHeader():void {

        const selectedCompetitors =this.competitors.filter(comp=> {
            return comp.selected == true;
        });
        //building headers

        //date header
        let settings:object = { timeValue: {title: '날짜'} };
        if(this.viewMode ==='competitor') {
            // share header
            selectedCompetitors.forEach(comp=> {
                settings['share_'+ comp.coId] = {title:['점유율', comp.name], type: 'string'};
            });
            // competitor header
            selectedCompetitors.forEach(comp=> {
                this.cat2.forEach(c => {
                    const foundCat = this.cat2Depths.find(cat=> {
                        return cat.key == c;
                    });
                    settings['comp_' + comp.coId + '_cate_'+ foundCat.key]  = {title: [comp.name, foundCat.label],type: 'number'};
                });
                settings['sum_' + comp.coId ] = {title:[comp.name, '합계'], type: 'number'};
            });
        } else {
            this.cat2.forEach(c => {
                const foundCat = this.cat2Depths.find(cat=> {
                    return cat.key == c;
                });
                selectedCompetitors.forEach(comp => {
                    settings['cate_'+ foundCat.key + '_comp_' + comp.coId ] = {title: [foundCat.label, comp.name], type: 'number'};
                });
                settings['sum_' + foundCat.key] = {title: [foundCat.label, '합계'], type: 'number'};
                settings['percent_' + foundCat.key] = {title: [foundCat.label, '퍼센트'], type: 'string'};

            });
        }
        // sum header
        settings['totalSales'] = {title:'합계', type: 'number'};

        this.dataSettings = {
            table: this.dataSettings['table'],
            column: settings
        };
    }


    onFilterSummaryByCategory(): void {
        this.blockUI.start();
        this.competitorService.getSummaryByCategory(this.competitorByCategoryFilter, SummaryCategoryType.Leaf, this.pagination.pageRequest).subscribe(serverResponse => {
            switch(serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let competitorByCategoryResponse =  serverResponse as CompetitorByCategoryResponse;
                    this.storeResponseAtViewMode(competitorByCategoryResponse);
                    this.refreshContents();
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop()
            }


        }, error => {
            console.log('error to find summary by category', error);
            this.blockUI.stop();
        });
    }

    transformSumSales(sumSalesResponse: SumAllSalesResponse, mode: string): any {
        let cateSumSales: SummaryTotalSales[] = sumSalesResponse.data;
        let sumAll = _.sumBy(cateSumSales, cateSum=> cateSum.sumSales);

        let sumDataRow:object = {};
        //sum name footer
        if(!_.isEmpty(cateSumSales)) {
            sumDataRow['timeValue'] = '합계';
            if (mode === 'competitor') {
                _.chain(cateSumSales).groupBy('coId').forEach((cates, coId) => {
                    let sumPerCor = _.sumBy(cates, cate => cate.sumSales);
                    sumDataRow['share_' + coId] = ((sumPerCor / sumAll) * 100).toFixed(1) + '%';
                    sumDataRow['sum_' + coId] = sumPerCor;
                    cates.forEach(cat => {
                        sumDataRow['comp_' + cat.coId + '_cate_' + cat.categoryNo] = cat.sumSales;
                    });

                }).value();
            } else {
                _.chain(cateSumSales).groupBy('categoryNo').forEach((catCorps, catNo) => {
                    let sumPerCat = _.sumBy(catCorps, cate => cate.sumSales);
                    sumDataRow['sum_' + catNo] = sumPerCat;
                    sumDataRow['percent_' + catNo] = ((sumPerCat / sumAll) * 100).toFixed(1) + '%';
                    catCorps.forEach(cor => {
                        sumDataRow['cate_' + cor.categoryNo + '_comp_' + cor.coId] = cor.sumSales;
                    })

                }).value();
            }
            sumDataRow['totalSales'] = sumAll
        }
        return sumDataRow;
    }
    transformForecastSales(forecastResponse: ForecastSalesResponse, mode: string): any {
        let forecastCatSales: ForecastSales[] = forecastResponse.data;
        let sumAll = _.sumBy(forecastCatSales, cate=> cate.forecastSales);

        let forecastDataRow:object = {};
        //sum name footer
        if(!_.isEmpty(forecastCatSales)) {
            forecastDataRow['timeValue'] = this.getMonthNumberAtEndDate().toString() + '월말 예측';
            if (mode === 'competitor') {
                _.chain(forecastCatSales).groupBy('coId').forEach((cates, coId) => {
                    let sumPerCor = _.sumBy(cates, cate => cate.forecastSales);
                    forecastDataRow['share_' + coId] = ((sumPerCor / sumAll) * 100).toFixed(1) + '%';
                    forecastDataRow['sum_' + coId] = sumPerCor;
                    cates.forEach(cat => {
                        forecastDataRow['comp_' + cat.coId + '_cate_' + cat.categoryNo] = cat.forecastSales;
                    });
                }).value();
            } else {
                _.chain(forecastCatSales).groupBy('categoryNo').forEach((catCorps, catNo) => {
                    let sumPerCat = _.sumBy(catCorps, cate => cate.forecastSales);
                    forecastDataRow['sum_' + catNo] = sumPerCat;
                    forecastDataRow['percent_' + catNo] =((sumPerCat / sumAll) * 100).toFixed(1) + '%';
                    catCorps.forEach(cor => {
                        forecastDataRow['cate_' + cor.categoryNo + '_comp_' + cor.coId] = cor.forecastSales;
                    })
                }).value();
            }
            forecastDataRow['totalSales' ] = sumAll;
        }
        return forecastDataRow;
    }

    transformSummaries(competitorByCategoryResponse: CompetitorByCategoryResponse, mode: string): Array<any>  {
        const dataRanges: CategorySummaryPerDateUnit[] = competitorByCategoryResponse.data;
        if(mode ==='competitor') {
            //
            return dataRanges.map(perDateUnit=> {
                let dataRow: object = {};

                const timeValue =  this.transformToTimeValue(perDateUnit);
                dataRow['timeValue'] = timeValue.timeStr;

                const byCompetitors = this.transformToSummaryByCompetitor(perDateUnit.summaries);

                const totalSales = _.sumBy(byCompetitors, comp=> comp.sumAll);
                dataRow['totalSales'] = totalSales;

                byCompetitors.forEach(comp=> {
                    dataRow['share_'+ comp.coId] = ((comp.sumAll /  totalSales) *100).toFixed(1) + '%';
                    comp.summaries.forEach(it=> {
                        dataRow['comp_' + comp.coId + '_cate_'+ it.categoryNo]= it.sales;
                    });
                    dataRow['sum_' + comp.coId ] = comp.sumAll;
                });

                return dataRow;
            })
        } else {
            return dataRanges.map(perDateUnit=> {
                let dataRow: object = {};

                const  summaries = perDateUnit.summaries;
                const timeValue =  this.transformToTimeValue(perDateUnit);
                dataRow['timeValue'] = timeValue.timeStr;

                const byCategories = this.transformToSummaryByCategory(summaries);

                const totalSales = _.sumBy(byCategories, cate=> cate.sumAll);
                dataRow['totalSales'] = totalSales;

                byCategories.forEach( cate => {
                    cate.percent = ((cate.sumAll / totalSales) * 100).toFixed(1) + '%';
                    cate.summaries.forEach(s =>{
                        dataRow['cate_'+ cate.categoryNo + '_comp_' + s.coId] = s.sales;
                    });
                    dataRow['sum_'+ cate.categoryNo] = cate.sumAll;
                    dataRow['percent_' + cate.categoryNo]= cate.percent;

                });
                return dataRow;
            });
        }

    }
    transformToTimeValue( perDateUnit: CategorySummaryPerDateUnit): TimeValue {
        switch (perDateUnit.dateUnit) {
            case 'daily': {
                return new TimeValue(perDateUnit.fromDate, perDateUnit.dateUnit);
            }
            case 'weekly': {
                return new TimeValue(perDateUnit.fromDate + "~" + perDateUnit.toDate, perDateUnit.dateUnit);
            }
            default : {
                return new TimeValue(perDateUnit.fromDate + "~" + perDateUnit.toDate, perDateUnit.dateUnit);
            }
        }
    }

    transformToSummaryByCategory(summaries: CategorySummaryPerCompetitor[]): Array<SummaryByCategory> {

        let summaryItems= _.flatMap(summaries, summary=> summary.items);

        let listOfSummaryByCategory = _.chain(summaryItems).groupBy('categoryNo').map((items, categoryNo) => {
            const sumAll = _.sumBy(items, it=> it.sales);
            return new SummaryByCategory(categoryNo, sumAll, undefined, items);
        }).value();

        return listOfSummaryByCategory;
    }

    transformToSummaryByCompetitor(summaries: CategorySummaryPerCompetitor[]): Array<SummaryByCompetitor> {

        let competitors = summaries.map(summary => {
           let sumOfAll = _.sumBy(summary.items, it=> it.sales);
           return new SummaryByCompetitor(summary.coId, sumOfAll, summary.items);
        });
        return competitors
    }

    isDisplayForecast(): boolean {

        let monthAtEndDate = this.getMonthNumberAtEndDate();

        const isCurrentMonth = (monthAtEndDate === (moment().month() + 1));
        return isCurrentMonth && this.competitorByCategoryFilter.dateUnit ==='daily';
    }


    getMonthNumberAtEndDate():number {
        let jsEndDate = this.competitorByCategoryFilter.endDate.jsdate;
        let momentDate = moment(jsEndDate);
        return momentDate.month() + 1;
    }


    collectFilterParams(): void {
        this.competitorByCategoryFilter.setPropValue('categoriesNo', this.cat2);
        const coIds = this.competitors.filter(c=> c.selected==true).map(c=> c.coId);
        this.competitorByCategoryFilter.setPropValue('coIds', coIds);

    }

}

