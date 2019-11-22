import {Injectable} from "@angular/core";
import {ApiService} from "../../../../shared/services/api.service";
import {Http, URLSearchParams} from "@angular/http";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {Observable} from "rxjs";
import {NaverPriceComparisonFilter} from "../models/naver-price-comparision";
import {PageRequest} from "../../../../shared/models/page-request";
import {NaverFilter} from "../../../naver-search/models/naver-filter";

const GET_CATEGORY_DEPTH_FILTER = '/api/best100/category';
const GET_KEYWORD_AND_BRANCH = '/api/best100/retrieveKeywordBrand';
const GET_PRODUCTS = '/api/best100/search';
const EXPORT_EXCEL = 'api/best100/excel';
const GET_LAST_CRAWLING_DATE = '/api/best100/lastcrawlingdate';
import {formatDate} from "../../../../shared/utils";
@Injectable()
export class NaverPriceComparisonService {
    constructor(private apiService: ApiService,
                private http: Http,
                private blockUI: BlockUIService) {
    }

    onLoadCategoryDepth(filter: NaverPriceComparisonFilter): Observable<any> {

        let searchParams: URLSearchParams = new URLSearchParams();


        searchParams.set('searchDate', this.formatToDateTime(filter.searchDate.formatted, '', ''));

        return this.apiService.getRaw(GET_CATEGORY_DEPTH_FILTER, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))

    }

    onLoadCategoryDepthForNaver(filter: NaverFilter): Observable<any> {

        let searchParams: URLSearchParams = new URLSearchParams();

        searchParams.set('searchDate', formatDate(filter.searchDate));
        // searchParams.set('searchDate', '2019-05-22');

        return this.apiService.getRaw(GET_CATEGORY_DEPTH_FILTER, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))

    }

    getLastCrawlingDate(): Observable<any> {
        return this.apiService.getRaw(GET_LAST_CRAWLING_DATE, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    loadKeywordOrBranch(filter: NaverPriceComparisonFilter, isBranch): Observable<any> {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set('searchDate', this.formatToDateTime(filter.searchDate.formatted, '', ''));
        searchParams.set('cateNo1', filter.cat1);
        searchParams.set('cateNo2', filter.cat2);
        searchParams.set('isBrand', isBranch);

        return this.apiService.getRaw(GET_KEYWORD_AND_BRANCH, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }

    loadProducts(filter: NaverPriceComparisonFilter, pageRequest: PageRequest, naverTmonMatching: boolean): Observable<any> {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set('searchDate', this.formatToDateTime(filter.searchDate.formatted, '', ''));
        searchParams.set('cateNo1', filter.cat1);
        searchParams.set('cateNo2', filter.cat2);
        searchParams.set('productName', filter.productName);
        searchParams.set('page', pageRequest.page.toString());
        searchParams.set('limit', pageRequest.size.toString());
        searchParams.set('isTmonMatching', naverTmonMatching ? 'Y': 'N');

        return this.apiService.getRaw(GET_PRODUCTS, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }

    onExportDealsToExcel(filter: NaverPriceComparisonFilter) {
        this.apiService.downloadExcelFile(EXPORT_EXCEL + "?searchDate=" + this.formatToDateTime(filter.searchDate.formatted, '', '')
            + "&cateNo1=" + filter.cat1 + "&cateNo2=" + filter.cat2 + "&productName=" + filter.productName);
    }

    formatToDateTime(dateStr: string, hours: string, minutes: string) {
        if (hours == '' || minutes == '') {
            return `${dateStr}`;
        }
        let timeStr = `${hours}:${minutes}:00`;
        return `${dateStr}T${timeStr}`;
    }

}
