import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http, Response, URLSearchParams} from "@angular/http";
import {ApiService} from "../../../shared/services/api.service";
import {PageRequest} from "../../../shared/models/page-request";
import {BlockUIService} from "../../../shared/services/block-ui.service";

const GET_NAVER_DEALS = 'api/snoop/naver/deal';
const TRIGGER_CRAWLING = 'api/snoopy/naver/triggercrawling';
const EXPORT_DEALS_TO_EXCEL = '/api/navercrawl/excel.xlsx';

@Injectable()
export class NaverSearchService {

    constructor(private apiService: ApiService,
                private http: Http,
                private blockUI: BlockUIService) {
    }

    onTriggerCrawling(pageRequest: PageRequest, keywords: string, sessionId: string, preKeyword: string,
                      categoryId: string, minPrice: string, maxPrice: string): Observable<any> {
        console.log("Trigger crawling...");
        return this.apiService.postRaw(TRIGGER_CRAWLING, {
            keywords: encodeURIComponent(keywords),
            sessionId: sessionId,
            preKeyword: preKeyword,
            categoryId: categoryId,
            minPrice: minPrice,
            maxPrice: maxPrice
        }).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    onExportDealsToExcel(sessionId: string) {
        console.log("Download file...");
        this.apiService.downloadExcelFile(EXPORT_DEALS_TO_EXCEL + "?sessionId=" + sessionId);
    }

    onSearchDeals(offset: number, limit: number, sessionId: string): Observable<any> {
        console.log("Search...");
        let params = new Map<string, string>();
        params.set("offset", offset != null ? offset.toString(): "");
        params.set("limit",  limit != null ? limit.toString(): "");
        params.set("sessionId", sessionId);
        return this.apiService.getRaw(GET_NAVER_DEALS, this.buildParameter(params)).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    buildParameter(params: Map<string, string>){

        let searchParams: URLSearchParams = new URLSearchParams();
        if (params != null && params != undefined) {
            params.forEach((value: string, key: string) => {
                searchParams.set(key, value);
            });
        }

        console.log('URL:' + searchParams);

        return searchParams;
    }

    formatToDateTime(dateStr: string, hours: string, minutes: string) {
        let hourStr ='';
        let minutesStr='';

        if(hours ==='') {
            hourStr +='00';
            if(minutes =='') {
                minutesStr += '00';
            } else {
                minutesStr += minutes;
            }
        } else {
            hourStr = hours;
            if(minutes =='') {
                minutesStr += '00';
            } else {
                minutesStr += minutes;
            }
        }
        let timeStr = `${hourStr}:${minutesStr}:00`;
        return `${dateStr}T${timeStr}`;
    }
}
