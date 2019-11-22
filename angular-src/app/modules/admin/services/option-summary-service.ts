import {Injectable} from "@angular/core";
import {ApiService} from "../../../shared/services/api.service";
import {Observable} from "rxjs/Observable";
import {OptionSummaryFilter} from "../models/option";

@Injectable()
export class OptionSummaryService {

    public static OPTION_SUMMARY_LIST = '/api/optionSummary/list';
    public static OPTION_SUMMARY_CATEGORIES = '/api/optionSummary/categories';
    public static OPTION_SUMMARY_EXCEL_EXPORT = '/api/optionSummary/excel.xlsx';

    constructor(private apiService: ApiService) {
    }

    getOptionSummaries(optionSummaryFilter: OptionSummaryFilter): Observable<any> {
        let url = OptionSummaryService.OPTION_SUMMARY_LIST + `?competitor=${optionSummaryFilter.competitor}&category=${optionSummaryFilter.category}&type=${optionSummaryFilter.type}&search=${optionSummaryFilter.search}&startDate=${optionSummaryFilter.startDate.formatted}&endDate=${optionSummaryFilter.endDate.formatted}`;
        return this.apiService.getRaw(url, null);
    }

    getCategories(): Observable<any> {
        return this.apiService.getRaw(OptionSummaryService.OPTION_SUMMARY_CATEGORIES, null);
    }

    exportExcel(optionSummaryFilter: OptionSummaryFilter): void {
        let url = OptionSummaryService.OPTION_SUMMARY_EXCEL_EXPORT +
            `?competitor=${optionSummaryFilter.competitor}&category=${optionSummaryFilter.category}&type=${optionSummaryFilter.type}&search=${optionSummaryFilter.search}&startDate=${optionSummaryFilter.startDate.formatted}&endDate=${optionSummaryFilter.endDate.formatted}`;

        window.open(url);
    }
}