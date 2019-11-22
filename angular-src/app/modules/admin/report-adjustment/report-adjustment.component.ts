import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import * as _ from "lodash";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {ActivatedRoute, Router} from "@angular/router";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {DialogService} from "ng2-bootstrap-modal";
import {
    CategoryGroupsInDetailResponse,
    CategorySummaryPerCompetitor,
    CategorySummaryPerDateUnit,
    CompetitorByCategoryFilter,
    CompetitorByCategoryFilterRequest,
    CompetitorByCategoryResponse,
    ContentsAtCompetitorView,
    ForecastSales,
    ForecastSalesResponse,
    SumAllSalesResponse,
    SummaryByCompetitor,
    SummaryCategoryType,
    SummaryTotalSales,
    TimeValue,
    TotalCompetitorByCategoryResponse
} from "../../competitor/models/competitor-by-category";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import * as moment from "moment";
import {Subscription} from "rxjs/Subscription";
import {forkJoin} from "rxjs/observable/forkJoin";
import {CompetitorService} from "../../competitor/services/competitor-service";
import {PageRequest} from "../../../shared/models/page-request";
import {TranslateService} from "@ngx-translate/core";
import {formatNumber, showErrorPopup} from "../../../shared/utils";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {CellData, RequestBody} from "../models/cell-data";
import {ReportAdjustmentService} from "../services/report-adjustment-service";

const CURRENT_URL = '/admin/report-adjustment';

@Component({
    selector: 'app-report-adjustment',
    templateUrl: './report-adjustment.component.html',
    styleUrls: ['./report-adjustment.component.css']
})
export class ReportAdjustmentComponent implements OnInit, OnDestroy {

    constructor(private competitorService: CompetitorService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService,
                private dialogService: DialogService,
                private translateService: TranslateService,
                private reportAjustmentService: ReportAdjustmentService) {

        this.pageRequest = new PageRequest();
        this.blockUI.vRef = this.viewContainerRef;


    }

    navSubscription: Subscription;

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    filterRequest: CompetitorByCategoryFilterRequest = null;

    pageRequest: PageRequest;
    filter: CompetitorByCategoryFilter = new CompetitorByCategoryFilter();

    categoryMapNoAndName = {};
    assignedCategoriesInRole: string[] = [];
    role: string;

    dataContents: object[];
    changedRemovedCellsMap = new Map<string, CellData>();

    contentsAsCompetitorView: ContentsAtCompetitorView = new ContentsAtCompetitorView();

    dataSettings: object = {
        table: {
            width: '2000px'
        }
    };

    competitors = [
        {coId: 'tmn', selected: true, name: 'TMN'},
        {coId: 'wmp', selected: true, name: 'WMP'}
    ];

    departments = [];
    departmentMap = {};
    teams = [];

    dateUnits = [
        {key: 'daily', label: '일단위', selected: true},
        {key: 'weekly', label: '주단위'},
        {key: 'monthly', label: '월단위'},
    ];

    currencyUnits = [
        {key: 'mw', label: '백만원'},
        {key: 'tw', label: '천원'},
        {key: 'w', label: '원', selected: true},
    ];


    loadTeamsByDepartment(reset = false) {
        let department = this.filter.departmentId;
        let teams = [];
        if (department !== '') {
            teams = this.departmentMap[department];
        }
        this.teams = teams;
        if (reset) {
            this.filter.teamId = '';
        }
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pageRequest.page = event.page - 1;
            this.onFilterSummaryByCategory();
        }
    }

    ngOnInit() {
        let departmentsObservable: Observable<any> = Observable.create((observer: Observer<any>) => {
            this.onLoadDepartments(observer);
        });

        departmentsObservable.subscribe((value) => {
        }, (error) => {
        }, () => {

            this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
                // skip search on load page
                let params = RouteUtils.extractParams(this.route, {});
                this.filter.bind(params);

                this.buildFilterRequest();
                this.buildTableHeader();
                this.onSearchCallApi();

            });
        })
    }

    onSearch(): void {
        this.pageRequest = new PageRequest();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.filter.unbind(), true);
    }

    onReset(): void {
        this.filter = new CompetitorByCategoryFilter();
        this.pageRequest = new PageRequest();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.filter.unbind());
    }


    onExportExcel(): void {
        let summaryCategoryType = this.isSelectedDepartment() ? SummaryCategoryType.Group : SummaryCategoryType.Leaf;
        this.competitorService.exportSalesToExcel(this.filterRequest, this.filter, summaryCategoryType, this.isDisplayForecast(), this.pageRequest);
    }


    onSearchCallApi() {
        this.blockUI.start();
        this.dataContents = [];
        let summaryCategoryType = this.isSelectedDepartment() ? SummaryCategoryType.Group : SummaryCategoryType.Leaf;

        let total = this.competitorService.getTotalSummaryByCategory(this.filterRequest, summaryCategoryType);
        let summaries = this.competitorService.getSummaryByCategory(this.filterRequest, summaryCategoryType, this.pageRequest);
        let sumSales = this.competitorService.getSumAllSales(this.filterRequest, summaryCategoryType);

        const isForecast = this.isDisplayForecast();

        if (isForecast) {
            let forecastSales = this.competitorService.getForecastSales(this.filterRequest, summaryCategoryType);
            forkJoin(total, summaries, sumSales, forecastSales).subscribe(results => {
                this.pageRequest.totalItems = (results[0] as TotalCompetitorByCategoryResponse).data;
                this.storeResponseAtViewMode(results[1] as CompetitorByCategoryResponse, results[2] as SumAllSalesResponse, results[3] as ForecastSalesResponse);
                this.refreshContents();
                this.blockUI.stop();
            }, error => {
                this.blockUI.stop();
                this.translateService.get('message.err_unknown').subscribe(msg => {
                    showErrorPopup(this.dialogService, this.translateService, msg);
                });

            });
        } else {
            forkJoin(total, summaries, sumSales).subscribe(results => {
                this.pageRequest.totalItems = (results[0] as TotalCompetitorByCategoryResponse).data;
                this.storeResponseAtViewMode(results[1] as CompetitorByCategoryResponse, results[2] as SumAllSalesResponse);
                this.refreshContents();
                this.blockUI.stop();

            }, error => {
                this.blockUI.stop();
                this.translateService.get('message.err_unknown').subscribe(msg => {
                    showErrorPopup(this.dialogService, this.translateService, msg);
                });

            })
        }
    }

    storeResponseAtViewMode(competitorByCategoryResponse: CompetitorByCategoryResponse,
                            sumAllSalesResponse?: SumAllSalesResponse,
                            forecastSalesResponse?: ForecastSalesResponse) {
        this.contentsAsCompetitorView.contents = this.transformSummaries(competitorByCategoryResponse);
        if (sumAllSalesResponse != undefined) {
            this.contentsAsCompetitorView.sumSales = this.transformSumSales(sumAllSalesResponse);
        }
        if (forecastSalesResponse != undefined) {
            this.contentsAsCompetitorView.forecastSales = this.transformForecastSales(forecastSalesResponse);
        }
    }

    refreshContents() {
        this.dataContents = [];
        this.dataContents = Object.assign([], this.contentsAsCompetitorView.contents);
        if (!_.isEmpty(this.contentsAsCompetitorView.sumSales)) {
            this.dataContents.push(this.contentsAsCompetitorView.sumSales);
        }
        if (this.isDisplayForecast() && !_.isEmpty(this.contentsAsCompetitorView.forecastSales)) {
            this.dataContents.push(this.contentsAsCompetitorView.forecastSales);
        }
    }

    buildTableHeader(): void {

        //date header
        let settings: object = {timeValue: {title: '날짜'}};
        // share header
        this.competitors.forEach(comp => {
            settings['share_' + comp.coId] = {title: ['점유율', comp.name], type: 'string'};
        });
        // competitor header
        this.competitors.forEach(comp => {
            this.filterRequest.categoriesNo.forEach(cNo => {
                const foundCat = this.findSelectedCategory(cNo);

                settings['comp_' + comp.coId + '_cate_' + foundCat.id] =
                    {
                        title: [comp.name, foundCat.name],
                        align: 'right',
                        clickable: true,
                        render: (data: { value: any, item: object }, settings: object) => {

                            let cancel = data.item['cancel_' + comp.coId + '_cate_' + foundCat.id];

                            let value = data.item['comp_' + comp.coId + '_cate_' + foundCat.id];
                            if(value != undefined && value != null)
                                value = formatNumber(value);
                            else
                                value = '0';

                            if (cancel) {
                                return '<span style="color:red;font-weight:bold;text-decoration:line-through">' + value + '</span>';
                            }
                            return '<span>' + value + '</span>';
                        },
                    };
            });
            settings['sum_' + comp.coId] = {title: [comp.name, '합계'], type: 'number'};
        });

        // sum header
        settings['totalSales'] = {title: '합계', type: 'number'};

        this.dataSettings = {
            table: this.dataSettings['table'],
            column: settings
        };
    }


    onFilterSummaryByCategory(): void {
        this.blockUI.start();
        let summaryCategoryType = this.isSelectedDepartment() ? SummaryCategoryType.Group : SummaryCategoryType.Leaf;

        this.competitorService.getSummaryByCategory(this.filterRequest, summaryCategoryType, this.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    break;
                }
                case 'OK': {
                    let competitorByCategoryResponse = serverResponse as CompetitorByCategoryResponse;
                    this.storeResponseAtViewMode(competitorByCategoryResponse);
                    this.refreshContents();
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error to find summary by category', error);
            this.blockUI.stop();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
    }

    onLoadDepartments(departmentsObserver: Observer<any>): void {
        this.blockUI.start();
        this.competitorService.loadDepartmentsInDetail().subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                }
                case 'OK': {
                    let departmentsInDetails = serverResponse as CategoryGroupsInDetailResponse;
                    departmentsInDetails.data.forEach(gr => {
                        let dep = gr.childs.find(c => c.cateNo == gr.cateNo);
                        this.departments.push({name: dep.name, id: dep.cateNo});
                        this.categoryMapNoAndName[dep.cateNo] = dep.name;
                        this.departmentMap[gr.cateNo] = gr.childs.filter(
                            c => c.cateNo != gr.cateNo
                        ).map(ct => {
                            let t = {name: ct.name, id: ct.cateNo};
                            this.categoryMapNoAndName[ct.cateNo] = ct.name;
                            return t
                        });


                    });
                    if (this.filter.departmentId !== '') {
                        this.teams = this.departmentMap[this.filter.departmentId];
                    }

                }
            }
            this.blockUI.stop();
            departmentsObserver.complete();
        }, error => {
            console.log('error to load departments', error);
            this.blockUI.stop();
            departmentsObserver.complete();
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
    }


    transformSumSales(sumSalesResponse: SumAllSalesResponse): any {
        let cateSumSales: SummaryTotalSales[] = sumSalesResponse.data;
        let sumAll = _.sumBy(cateSumSales, cateSum => cateSum.sumSales);

        let sumDataRow: object = {};
        //sum name footer
        if (!_.isEmpty(cateSumSales)) {
            sumDataRow['timeValue'] = '합계';
            _.chain(cateSumSales).groupBy('coId').forEach((cates, coId) => {
                let sumPerCor = _.sumBy(cates, cate => cate.sumSales);
                sumDataRow['share_' + coId] = ((sumPerCor / sumAll) * 100).toFixed(1) + '%';
                sumDataRow['sum_' + coId] = this.getPriceInUnit(sumPerCor);
                cates.forEach(cat => {
                    sumDataRow['comp_' + cat.coId + '_cate_' + cat.categoryNo] = this.getPriceInUnit(cat.sumSales);
                });

            }).value();
            sumDataRow['totalSales'] = this.getPriceInUnit(sumAll);
        }
        return sumDataRow;
    }

    transformForecastSales(forecastResponse: ForecastSalesResponse): any {
        let forecastCatSales: ForecastSales[] = forecastResponse.data;
        let sumAll = _.sumBy(forecastCatSales, cate => cate.forecastSales);

        let forecastDataRow: object = {};
        //sum name footer
        if (!_.isEmpty(forecastCatSales)) {
            forecastDataRow['timeValue'] = this.getMonthNumberAtEndDate().toString() + '월말 예측';
            _.chain(forecastCatSales).groupBy('coId').forEach((cates, coId) => {
                let sumPerCor = _.sumBy(cates, cate => cate.forecastSales);
                forecastDataRow['share_' + coId] = ((sumPerCor / sumAll) * 100).toFixed(1) + '%';
                forecastDataRow['sum_' + coId] = this.getPriceInUnit(sumPerCor);
                cates.forEach(cat => {
                    forecastDataRow['comp_' + cat.coId + '_cate_' + cat.categoryNo] = this.getPriceInUnit(cat.forecastSales);
                });
            }).value();
            forecastDataRow['totalSales'] = this.getPriceInUnit(sumAll);
        }
        return forecastDataRow;
    }

    transformSummaries(competitorByCategoryResponse: CompetitorByCategoryResponse): Array<any> {
        const dataRanges: CategorySummaryPerDateUnit[] = competitorByCategoryResponse.data;
        return dataRanges.map(perDateUnit => {
            let dataRow: object = {};

            const timeValue = this.transformToTimeValue(perDateUnit);
            dataRow['timeValue'] = timeValue.timeStr;

            const byCompetitors = this.transformToSummaryByCompetitor(perDateUnit.summaries);

            const totalSales = _.sumBy(byCompetitors, comp => comp.sumAll);
            dataRow['totalSales'] = this.getPriceInUnit(totalSales);

            byCompetitors.forEach(comp => {
                dataRow['share_' + comp.coId] = ((comp.sumAll / totalSales) * 100).toFixed(1) + '%';
                comp.summaries.forEach(it => {

                    dataRow['comp_' + comp.coId + '_cate_' + it.categoryNo] = this.getPriceInUnit(it.sales);
                    dataRow['cancel_' + comp.coId + '_cate_' + it.categoryNo] = it.cancel;
                });
                dataRow['sum_' + comp.coId] = this.getPriceInUnit(comp.sumAll);
            });

            return dataRow;
        })

    }

    transformToTimeValue(perDateUnit: CategorySummaryPerDateUnit): TimeValue {
        switch (perDateUnit.dateUnit) {
            case 'daily': {
                return new TimeValue(perDateUnit.fromDate + '(' + this.getKoreanWeekday(perDateUnit.fromDate) + ')', perDateUnit.dateUnit);
            }
            case 'weekly': {
                return new TimeValue(perDateUnit.fromDate + '(' + this.getKoreanWeekday(perDateUnit.fromDate) + ')'
                    + "~" + perDateUnit.toDate + '(' + this.getKoreanWeekday(perDateUnit.toDate) + ')', perDateUnit.dateUnit);
            }
            default : {
                return new TimeValue(this.getMonthFormat(perDateUnit.fromDate), perDateUnit.dateUnit);
            }
        }
    }

    transformToSummaryByCompetitor(summaries: CategorySummaryPerCompetitor[]): Array<SummaryByCompetitor> {

        let competitors = summaries.map(summary => {
            let sumOfAll = _.sumBy(summary.items, it =>
            {
                return it.sales;
            });
            return new SummaryByCompetitor(summary.coId, sumOfAll, summary.items);
        });
        return competitors
    }

    isDisplayForecast(): boolean {

        let monthAtEndDate = this.getMonthNumberAtEndDate();

        const isCurrentMonth = (monthAtEndDate === (moment().month() + 1));
        return isCurrentMonth && this.filter.dateUnit === 'daily';
    }


    getMonthNumberAtEndDate(): number {
        let jsEndDate = this.filter.endDate.jsdate;
        let momentDate = moment(jsEndDate);
        return momentDate.month() + 1;
    }

    getKoreanWeekday(dateStr: string): string {
        moment.locale('ko');
        const dateValue = moment(dateStr, "YYYY-MM-DD");
        const koreanWeekdayName = dateValue.format('ddd');
        moment.locale();
        return koreanWeekdayName
    }

    getMonthFormat(dateStr: string): string {
        const dateValue = moment(dateStr, "YYYY-MM-DD");
        let m = dateValue.month() + 1;
        if (m < 10) {
            return dateValue.year().toString() + '-' + '0' + m;
        }
        return dateValue.year().toString() + '-' + m;
    }

    getPriceInUnit(num: number): number {
        switch (this.filter.currencyUnit) {
            case 'mw':
                return num / 1000000;
            case 'tw':
                return num / 1000;
        }
        return num;
    }

    findSelectedCategory(id: number): any {
        let isSelected = this.isSelectedDepartment();
        if (isSelected) {
            return this.departments.find(dp => dp.id == id);
        } else {
            return this.teams.find(t => t.id == id);
        }
    }

    isSelectedDepartment(): boolean {
        if (this.filter.departmentId == '') {
            return true;
        } else if (this.filter.teamId == '') {
            return false;
        } else {
            return false;
        }
    }

    buildFilterRequest() {
        this.filterRequest = new CompetitorByCategoryFilterRequest(
            this.filter.startDate,
            this.filter.endDate,
            this.getSelectedCategoriesNo(),
            this.filter.coIds,
            this.filter.dateUnit);
    }

    getSelectedCategoriesNo(): number[] {
        let isSelected = this.isSelectedDepartment();
        if (isSelected) {
            if (this.filter.departmentId == '') {
                return this.departments.map(dp => parseInt(dp.id))
            } else {
                return [parseInt(this.filter.departmentId)];
            }
        } else {
            if (this.filter.teamId == '') {
                return this.teams.map(t => parseInt(t.id));
            } else {
                return [parseInt(this.filter.teamId)];
            }
        }
    }

    handleDealSaleTableAction({action, data, event}) {

        if (action == 'cellclick') {

            let cellId = data.colId;
            let rowData = data.item;
            let cellValue = rowData[cellId];
            let currentCell: HTMLElement = event.currentTarget;
            let cellInnerHTML = currentCell.innerHTML;
            //let cellStyle: CSSStyleDeclaration = currentCell.style;
            let coId = '';
            let cateId = '';
            if (cellId != undefined && cellId.length > 0) {
                let temp = cellId.split("_");
                coId = temp[1];
                cateId = temp[3];
            }

            let timeValue = rowData["timeValue"];
            if (timeValue !== undefined) {
                let tmp = timeValue.split("(");
                if (tmp.length > 1)
                    timeValue = tmp[0];
                else
                    return;
            }
            let key = cellId + "_" + timeValue;
            if (cellValue != undefined && cellValue !== '') {

                let value = new CellData(timeValue, coId, parseInt(cateId), cellValue, false);
                if (cellInnerHTML.startsWith("<span style=")) {
                    value.isCancel = false;
                    this.changedRemovedCellsMap.set(key, value);
                    //this.updateRowData(rowData, coId, cateId, cellValue, false);
                    currentCell.innerHTML = "<span>" + formatNumber(cellValue) + "</span>";
                } else {
                    value.isCancel = true;
                    this.changedRemovedCellsMap.set(key, value);
                    //this.updateRowData(rowData, coId, cateId, cellValue, true);
                    currentCell.innerHTML = "<span style='color:red;font-weight:bold;text-decoration:line-through;'>" + formatNumber(cellValue) + "</span>";
                }

            }

        }
    }

    updateRowData(rowData: object, coId: string, cateId: string, cellValue: number, removed: boolean): void {

        let len = this.dataContents.length;
        let rowSumData = this.dataContents[len-1];

        if (removed)
            cellValue = -cellValue;

        rowData["sum_" + coId] = rowData["sum_" + coId] + cellValue;

        let totalSales = 0;
        let rowTotalSales = 0;
        this.competitors.forEach(comp => {
            totalSales += rowData["sum_" + comp.coId] != undefined ? rowData["sum_" + comp.coId] : 0;
            rowTotalSales += rowSumData["sum_" + comp.coId] != undefined ? rowSumData["sum_" + comp.coId] : 0;
        });

        this.competitors.forEach(comp => {
            rowData["share_" + comp.coId] = (((rowData["sum_" + comp.coId] != undefined ? rowData["sum_" + comp.coId] : 0) / totalSales) * 100).toFixed(1) + '%';
            if(rowSumData != undefined) {
                rowSumData["share_" + comp.coId] = (((rowSumData["sum_" + comp.coId] != undefined ? rowSumData["sum_" + comp.coId] : 0) / rowTotalSales) * 100).toFixed(1) + '%';
            }
        });

        rowData["totalSales"] = totalSales;

        if(rowSumData != undefined){
            rowSumData['comp_' + coId + '_cate_' + cateId] = rowSumData['comp_' + coId + '_cate_' + cateId] + cellValue;
            rowSumData["sum_" + coId] = rowSumData["sum_" + coId] + cellValue;
            rowSumData["totalSales"] = rowTotalSales;
        }
    }

    applyChanges(): void {
        let cellsData = Array.from(this.changedRemovedCellsMap.values());
        if (cellsData.length > 0) {

            let body: RequestBody = new RequestBody();
            body.issues = cellsData;
            body.modifiedUser = window.localStorage.getItem('username');
            this.blockUI.start();
            this.reportAjustmentService.postApplyReportChanges(body).subscribe(response => {
                switch (response.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = response as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                        this.blockUI.stop();
                        break;
                    }
                    case 'OK': {
                        this.changedRemovedCellsMap.clear();
                        this.onSearch();
                        this.blockUI.stop();
                    }
                    default:
                        this.blockUI.stop();
                }
            }, error => {
                this.blockUI.stop();
                let errorMessage = this.translateService.instant("message.err_unknown");
                showErrorPopup(this.dialogService, this.translateService, errorMessage);
            });
        }
    }
}
