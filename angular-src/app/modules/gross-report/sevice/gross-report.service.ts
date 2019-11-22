import {Injectable} from "@angular/core";
import {ApiService} from "../../../shared/services/api.service";
import {Observable} from "rxjs/Observable";
import {URLSearchParams} from "@angular/http";
import {PageRequest} from "../../../shared/models/page-request";
import {GrossReportFilter} from "../model/grossReport";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import * as moment from "moment";

@Injectable()
export class GrossReportService {
    public static GROSS_REPORT = '/api/grossReport/list';
    public static EXCEL_EXPORT = '/api/grossReport/excel.xlsx';
    public static DATE_FORMAT = 'YYYY-MM-DD';
    public static REPORT_FOR_LAST_NUMBER_DAY = 6; // including current end date.

    constructor(private apiService: ApiService, private blockUI: BlockUIService) {

    }
    getGrossReport(grossReportFilter: GrossReportFilter, pageRequest: PageRequest): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();

        if (pageRequest != null) {
            params.set('page', pageRequest.page.toString());
            params.set('limit', pageRequest.size.toString());
        }
        params.set("coId", grossReportFilter.coId);
        params.set("startDate", grossReportFilter.startDate.formatted);
        params.set("endDate", grossReportFilter.endDate.formatted);
        if(grossReportFilter.sort != null)
            params.set("sort", grossReportFilter.sort);

        if (grossReportFilter.departmentId != null && grossReportFilter.departmentId.length > 0) {
            params.set('cat1', grossReportFilter.departmentId)
        } else
            params.set('cat1', '');

        if (grossReportFilter.teamId != null && grossReportFilter.teamId.length > 0) {
            params.set('cat2', grossReportFilter.teamId.toString())
        } else
            params.set('cat2', '');

        return this.apiService.getRaw(GrossReportService.GROSS_REPORT, params);
    }

    exportReportToExcel(grossReportFilter: GrossReportFilter): void {
        let params = "";

        let startDate = grossReportFilter.startDate.formatted;
        if(grossReportFilter.endDate != null){
            let jsStartDate = moment(grossReportFilter.endDate.formatted, GrossReportService.DATE_FORMAT).toDate();
            jsStartDate.setDate(jsStartDate.getDate() - GrossReportService.REPORT_FOR_LAST_NUMBER_DAY);
            startDate = moment(jsStartDate).format(GrossReportService.DATE_FORMAT)
        }

        params += "?coId=" + grossReportFilter.coId;
        params += "&startDate=" + startDate;
        params += "&endDate=" + grossReportFilter.endDate.formatted;

        let url = GrossReportService.EXCEL_EXPORT + params;
        console.info(url);
        //open new tab(blank page) for downloading
        window.open('');
        this.apiService.downloadExcelFile(url);
    }

}