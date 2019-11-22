import {Injectable} from "@angular/core";
import {ApiService} from "../../../../shared/services/api.service";
import {Http, URLSearchParams} from "@angular/http";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {Observable} from "rxjs";
import {NaverPriceComparisonFilter} from "../models/naver-price-comparision";
import {PageRequest} from "../../../../shared/models/page-request";
import {BestDealComparisonFilter} from "../models/best-deals-comparision";

const LOAD_DATA = 'api/bestproducts/comparebestdeals/search';
const EXPORT_EXCEL = 'api/bestproducts/comparebestdeals/exporting.xlsx';
@Injectable()
export class BestDealsComparisonService {
    constructor(private apiService: ApiService,
                private http: Http,
                private blockUI: BlockUIService) {
    }

    loadData(filter: BestDealComparisonFilter, pageRequest: PageRequest): Observable<any> {
        let searchParams: URLSearchParams = new URLSearchParams();
        if (filter.fromDateTime != null) {
            searchParams.set('fromDateTime', this.formatToDateTime(filter.fromDateTime.formatted, filter.hourAtStartDate));
        }
        if (filter.toDateTime != null) {
            searchParams.set('toDateTime', this.formatToDateTime(filter.toDateTime.formatted,
                filter.hourAtEndDate === ''? '23':filter.hourAtEndDate));
        }
        searchParams.set('productName', filter.dealName);
        searchParams.set('coIds', "tmn,gmrk,wmp");
        searchParams.set('page', pageRequest.page.toString());
        searchParams.set('limit', pageRequest.size.toString());

        return this.apiService.getRaw(LOAD_DATA, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }

    onExportDealsToExcel(filter: BestDealComparisonFilter, pageRequest: PageRequest) {
        this.apiService.downloadExcelFile(EXPORT_EXCEL + "?fromDateTime=" + this.formatToDateTime(filter.fromDateTime.formatted, filter.hourAtStartDate) + "&toDateTime=" + this.formatToDateTime(filter.toDateTime.formatted,
            filter.hourAtEndDate === ''? '23':filter.hourAtEndDate) + "&productName=" + filter.dealName
                                          + "&coIds=tmn,gmrk,wmp&isShowCategory=" + filter.isShowCategory + "&isShowDealNo=" + filter.isShowDealNo + "&page=" + pageRequest.page.toString()
                                          + "&limit=" + pageRequest.size.toString());
    }

    formatToDateTime(dateStr: string, hours: string) {
        hours = (hours != null && hours != undefined && hours != "") ? hours : '00';
        let timeStr = `${hours}:00:00`;
        return `${dateStr}T${timeStr}`;
    }

}