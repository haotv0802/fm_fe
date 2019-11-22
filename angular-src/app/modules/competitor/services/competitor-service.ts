import {Injectable} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CompetitorSummaryFilter} from '../models/competitor-sale';
import {PageRequest} from "../../../shared/models/page-request";
import {
    CompetitorByCategoryFilter, CompetitorByCategoryFilterRequest,
    SummaryCategoryType
} from "../models/competitor-by-category";
import {BlockUIService} from "../../../shared/services/block-ui.service";

@Injectable()
export class CompetitorService {

    public static COMPETITOR_SUMMARY_URL = '/api/sumdealbyco_v2';
    public static COMPETITOR_SUMMARY_BY_CATEGORY = "api/competitor/summaryByCategory";
    public static COMPETITOR_SUMMARY_BY_CATEGORY_TOTAL = "api/competitor/summaryByCategory/total";
    public static COMPETITOR_SUMMARY_BY_CATEGORY_SUM_ALL = "api/competitor/summaryByCategory/sumSales";
    public static COMPETITOR_SUMMARY_BY_CATEGORY_FORECAST_END_MONTH = "api/competitor/summaryByCategory/forecast";
    public static COMPETITOR_SUMMARY_BY_CATEGORY_EXPORT_FORECAST_END_MONTH_TO_EXCEL = "api/competitor/summaryByCategory/forecast/excel.xlsx";
    public static CATEGORY_GROUPS_IN_DETAIL = "api/category/groups/detail";


    constructor(private apiService: ApiService, private blockUI: BlockUIService) {
    }


    getCompetitorSummary(summaryFilter: CompetitorSummaryFilter): Observable<any> {

        let searchParams: URLSearchParams = new URLSearchParams();
        if (summaryFilter.startDate != null) {
            searchParams.set('startDate', summaryFilter.startDate.formatted)
        }
        if (summaryFilter.endDate != null) {
            searchParams.set('endDate', summaryFilter.endDate.formatted)
        }
        if(summaryFilter.cat1 != null && summaryFilter.cat1.length > 0){
            searchParams.set('cat1', summaryFilter.cat1.toString())
        }else
            searchParams.set('cat1', '');

        if(summaryFilter.cat2 != null && summaryFilter.cat2.length > 0){
            searchParams.set('cat2', summaryFilter.cat2.toString())
        }else
            searchParams.set('cat2', '');

        searchParams.set('unit', summaryFilter.unit);
        searchParams.set('typeSearch', summaryFilter.typeSearch.toString());
        searchParams.set('typeSale', summaryFilter.typeSale.toString());

        return this.apiService.getRaw(CompetitorService.COMPETITOR_SUMMARY_URL, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    getSummaryByCategory(filterRequest: CompetitorByCategoryFilterRequest, summaryCategoryType: SummaryCategoryType, pageRequest: PageRequest): Observable<any> {

        const isValid = this.validateRequiredFilterParams(filterRequest);
        if(!isValid) {
            return Observable.throw(new Error("Required parameters are invalid"));
        }
        const searchParams: URLSearchParams = new URLSearchParams();
        if (pageRequest != null) {
            searchParams.set('page', pageRequest.page.toString());
            searchParams.set('limit', pageRequest.size.toString());
        }
        searchParams.set('startDate', filterRequest.startDate.formatted);
        searchParams.set('endDate', filterRequest.endDate.formatted);
        searchParams.set('baseDate', filterRequest.baseDate);
        searchParams.set('dateUnit', filterRequest.dateUnit);
        //summary category type as name
        searchParams.set('cateType', SummaryCategoryType[summaryCategoryType]);

        const categoriesNo = filterRequest.categoriesNo.join(",");
        const coIds = filterRequest.coIds.join(",");

        searchParams.set("categoriesNo", categoriesNo);
        searchParams.set("coIds", coIds);

        return this.apiService.getRaw(CompetitorService.COMPETITOR_SUMMARY_BY_CATEGORY, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    getTotalSummaryByCategory(filterRequest: CompetitorByCategoryFilterRequest, summaryCategoryType: SummaryCategoryType): Observable<any> {
        const isValid = this.validateRequiredFilterParams(filterRequest);
        if(!isValid) {
            return Observable.throw(new Error("Required parameters are invalid"));
        }

        const searchParams: URLSearchParams = new URLSearchParams();

        searchParams.set('startDate', filterRequest.startDate.formatted);
        searchParams.set('endDate', filterRequest.endDate.formatted);
        searchParams.set('baseDate', filterRequest.baseDate);
        searchParams.set('dateUnit', filterRequest.dateUnit);
        //summary category type as name
        searchParams.set('cateType', SummaryCategoryType[summaryCategoryType]);

        const categoriesNo = filterRequest.categoriesNo.join(",");
        const coIds = filterRequest.coIds.join(",");

        searchParams.set("categoriesNo", categoriesNo);
        searchParams.set("coIds", coIds);

        return this.apiService.getRaw(CompetitorService.COMPETITOR_SUMMARY_BY_CATEGORY_TOTAL, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }
    getSumAllSales(filterRequest: CompetitorByCategoryFilterRequest, summaryCategoryType: SummaryCategoryType): Observable<any> {
        const isValid = this.validateRequiredFilterParams(filterRequest);
        if(!isValid) {
            return Observable.throw(new Error("Required parameters are invalid"));
        }

        const searchParams: URLSearchParams = new URLSearchParams();

        searchParams.set('startDate', filterRequest.startDate.formatted);
        searchParams.set('endDate', filterRequest.endDate.formatted);
        searchParams.set('baseDate', filterRequest.baseDate);
        searchParams.set('dateUnit', filterRequest.dateUnit);
        searchParams.set('cateType', SummaryCategoryType[summaryCategoryType]);

        const categoriesNo = filterRequest.categoriesNo.join(",");
        const coIds = filterRequest.coIds.join(",");

        searchParams.set("categoriesNo", categoriesNo);
        searchParams.set("coIds", coIds);

        return this.apiService.getRaw(CompetitorService.COMPETITOR_SUMMARY_BY_CATEGORY_SUM_ALL, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    exportSalesToExcel(filterRequest: CompetitorByCategoryFilterRequest, filter: CompetitorByCategoryFilter, summaryCategoryType: SummaryCategoryType, hasForecast: boolean, pageRequest: PageRequest): void {

        pageRequest.page = pageRequest.page - 1; // since pagination increase page number by 1 (front-end)

        const isValid = this.validateRequiredFilterParams(filterRequest);
        if(!isValid) {
            return;
        }

        let params = "";

        const searchParams: URLSearchParams = new URLSearchParams();

        searchParams.set('baseDate', filterRequest.baseDate);

        const categoriesNo = filterRequest.categoriesNo.join(",");
        const coIds = filterRequest.coIds.join(",");

        params += "?baseDate=" + filterRequest.baseDate;
        params += "&categoriesNo=" + categoriesNo;
        params += "&coIds=" + coIds;
        params += "&cateType=" + SummaryCategoryType[summaryCategoryType];
        params += "&dateUnit=" + filterRequest.dateUnit;
        params += "&startDate=" + filterRequest.startDate.formatted;
        params += "&endDate=" + filterRequest.endDate.formatted;
        params += "&currencyUnit=" + filter.currencyUnit;
        params += "&hasForecast=" + hasForecast;

        if (pageRequest != null) {
            params += "&page=" + pageRequest.page.toString();
            params += "&limit=" + pageRequest.size.toString();
        }

        let url = CompetitorService.COMPETITOR_SUMMARY_BY_CATEGORY_EXPORT_FORECAST_END_MONTH_TO_EXCEL + params;
        console.info(url);
        //open new tab ( blank page) for downloading
        window.open('');
        this.apiService.downloadExcelFile(url);

    }

    getForecastSales(filterRequest: CompetitorByCategoryFilterRequest, summaryCategoryType: SummaryCategoryType): Observable<any> {
        const isValid = this.validateRequiredFilterParams(filterRequest);
        if(!isValid) {
            return Observable.throw(new Error("Required parameters are invalid"));
        }

        const searchParams: URLSearchParams = new URLSearchParams();

        searchParams.set('baseDate', filterRequest.baseDate);

        const categoriesNo = filterRequest.categoriesNo.join(",");
        const coIds = filterRequest.coIds.join(",");

        searchParams.set("categoriesNo", categoriesNo);
        searchParams.set("coIds", coIds);
        searchParams.set('cateType', SummaryCategoryType[summaryCategoryType]);

        return this.apiService.getRaw(CompetitorService.COMPETITOR_SUMMARY_BY_CATEGORY_FORECAST_END_MONTH, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }


    loadDepartmentsInDetail(): Observable<any> {

        return this.apiService.getRaw(CompetitorService.CATEGORY_GROUPS_IN_DETAIL, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }


    private validateRequiredFilterParams(filterRequest  : CompetitorByCategoryFilterRequest):boolean {
        if(filterRequest.dateUnit === undefined) {
            return false;
        }
        if(filterRequest.baseDate === undefined) {
            return false;
        }
        if(filterRequest.startDate === undefined) {
            return false;
        }
        if(filterRequest.endDate == undefined) {
            return false;
        }
        if(filterRequest.coIds === undefined
            || filterRequest.coIds.length ===0) {
            return false;
        }

        if(filterRequest.categoriesNo === undefined
            || filterRequest.categoriesNo.length ===0) {
            return false;
        }

        return true;

    }

}
