import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http, Response, URLSearchParams} from "@angular/http";
import {ProductPriceComparisonFilter} from "../models/product-price-comparison";
import {ApiService} from "../../../shared/services/api.service";
import {PageRequest} from "../../../shared/models/page-request";
import {BlockUIService} from "../../../shared/services/block-ui.service";

const GET_BEST_OPTION_HISTORY_DETAILS = "/api/bestoptions/detailoptionshistorybyid";
const GET_COUNT_PRODUCT_BEST_OPTION_URL = '/api/bestoptions/count';
const GET_PRODUCT_BEST_OPTION_URL = "/api/bestoptions/search";
const GET_EXPORT_EXCEL_PRODUCT_BEST_OPTIONS_PRICE = "api/bestoptions/exporting.xlsx";
const GET_CATEGORY_DEPTH_FILTER = "/api/categorymappers/getDepthCategories";

@Injectable()
export class ProductBestOptionService {

    constructor(private apiService: ApiService,
                private http: Http,
                private blockUI: BlockUIService) {
    }

    onSearchProductBestOption(filter: ProductPriceComparisonFilter, pageRequest: PageRequest): Observable<any> {
        console.log("Search...");

        return this.apiService.getRaw(GET_PRODUCT_BEST_OPTION_URL, this.buildParameter(filter, pageRequest)).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    onGetTotalProductBestOptions(filter: ProductPriceComparisonFilter): Observable<any> {
        console.log("Counting...");
        return this.apiService.getRaw(GET_COUNT_PRODUCT_BEST_OPTION_URL, this.buildParameter(filter, null)).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    onExportExcelProductBestOptions(filter: ProductPriceComparisonFilter): void{
        console.log("Export excel...");
        let url = GET_EXPORT_EXCEL_PRODUCT_BEST_OPTIONS_PRICE + '?' +this.buildParameter(filter, null).toString();
        console.info(url);
        //open new tab (new blank page) for downloading
        window.open('');
        this.apiService.downloadExcelFile(url);
    }

    onLoadCategoryDepth(filter: ProductPriceComparisonFilter, atDepth: number, compCatNo: string): Observable<any> {

        let searchParams: URLSearchParams = new URLSearchParams();


        searchParams.set('fromDateTime', this.formatToDateTime(filter.startDate.formatted, filter.hourAtStartDate, filter.minuteAtStartDate));
        searchParams.set('toDateTime', this.formatToDateTime(filter.endDate.formatted,
            filter.hourAtEndDate === ''? '23':filter.hourAtEndDate,
            filter.minuteAtEndDate===''? '50':  filter.minuteAtEndDate));

        if (filter.coId != null && filter.coId !== '') {
            searchParams.set("coId", filter.coId);
        }

        if (compCatNo != null && compCatNo !== '') {
            searchParams.set("compCatNo", compCatNo);
        }
        if (atDepth !=null) {
            searchParams.set('atDepth', atDepth.toString());
        }
        return this.apiService.getRaw(GET_CATEGORY_DEPTH_FILTER, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))

    }
    onGetBestOptionsHistoryDetails(filter: ProductPriceComparisonFilter, coId: string, productId:  string, optionId: number) {
        let searchParams: URLSearchParams = new URLSearchParams();

        searchParams.set('fromDateTime', this.formatToDateTime(filter.startDate.formatted, filter.hourAtStartDate, filter.minuteAtStartDate));

        searchParams.set('toDateTime', this.formatToDateTime(filter.endDate.formatted,
            filter.hourAtEndDate === ''? '23':filter.hourAtEndDate,
            filter.minuteAtEndDate===''? '50':  filter.minuteAtEndDate));

        searchParams.set('coId', coId);
        searchParams.set('productId', productId);
        searchParams.set('optionId', optionId.toString());

        return this.apiService.getRaw(GET_BEST_OPTION_HISTORY_DETAILS, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))

    }
    buildParameter(filter: ProductPriceComparisonFilter, pageRequest: PageRequest){

        let searchParams: URLSearchParams = new URLSearchParams();


        if (filter.startDate != null) {
            searchParams.set('fromDateTime', this.formatToDateTime(filter.startDate.formatted, filter.hourAtStartDate, filter.minuteAtStartDate));
        }
        if (filter.endDate != null) {
            searchParams.set('toDateTime', this.formatToDateTime(filter.endDate.formatted,
                filter.hourAtEndDate === ''? '23':filter.hourAtEndDate,
                filter.minuteAtEndDate===''? '50':  filter.minuteAtEndDate));
        }
        searchParams.set('coId', filter.coId);

        if(filter.dealName !='') {
            searchParams.set('productName', filter.dealName);
        }

        if(filter.optionName !='') {
            searchParams.set('optionName', filter.optionName);
        }

        searchParams.set('isExposureMainDeal', filter.exposeMainDeal == true ? "true" : "false");

        if(filter.categoryDepth1 !=='' || filter.categoryDepth2 !== '' || filter.categoryDepth3 !== ''){
            let cateNo = null;
            let depth = null;

            if(filter.categoryDepth3 !=='')
            {
                depth = 3;
                cateNo = filter.categoryDepth3;
            }else if(filter.categoryDepth2 !==''){
                depth = 2;
                cateNo = filter.categoryDepth2;
            }else if(filter.categoryDepth1 !== ''){
                depth = 1;
                cateNo = filter.categoryDepth1;
            }

            if(cateNo != null && depth != null){
                searchParams.set('cateNo', cateNo);
                searchParams.set('atDepth', depth.toString());
            }

        }

        if (pageRequest != null) {
            searchParams.set('page', pageRequest.page.toString());
            searchParams.set('limit', pageRequest.size.toString());
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
