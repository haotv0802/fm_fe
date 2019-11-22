import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ApiService} from '../../../shared/services/api.service';
import {URLSearchParams} from '@angular/http'
import {PageRequest} from '../../../shared/models/page-request';
import {CompCategoryOnDepth, DealSaleFilter} from '../models/deal-sale';
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {ProductPriceComparisonFilter} from "../../product-best-options/models/product-price-comparison";


@Injectable()
export class DealService {
    public static DEAL_SALES_URL = '/api/deallist';
    public static DEAL_SALES_EXCEL_EXPORT_URL = '/api/deallist/excel.xlsx';
    public static DEAL_SALE_DETAIL_URL = '/api/dealbycategory';
    public static DEAL_OPTION_URL = "/api/option";
    public static GET_CATEGORY_DEPTH_FILTER = "/api/deallist/categorymappers/getDepthCategories";

    constructor(private apiService: ApiService, private blockUI: BlockUIService) {
    }

    getDealSales(dealFilter: DealSaleFilter, categoryDepth1Items : CompCategoryOnDepth[], categoryDepth2Items : CompCategoryOnDepth[], categoryDepth3Items : CompCategoryOnDepth[], pageRequest: PageRequest): Observable<any> {

        let urlDealQuery: URLSearchParams = new URLSearchParams();
        let userId = window.localStorage.getItem('username');

        urlDealQuery.set('userId', userId);
        if (dealFilter.startDate != null) {

            urlDealQuery.set('startDate', dealFilter.startDate.formatted)
        }
        if (dealFilter.endDate != null) {
            urlDealQuery.set('endDate', dealFilter.endDate.formatted)
        }
        if (dealFilter.departmentId != null && dealFilter.departmentId.length > 0) {
            urlDealQuery.set('cat1', dealFilter.departmentId)
        } else
            urlDealQuery.set('cat1', '');

        if (dealFilter.teamId != null && dealFilter.teamId.length > 0) {
            urlDealQuery.set('cat2', dealFilter.teamId.toString())
        } else
            urlDealQuery.set('cat2', '');

        urlDealQuery.set('searchDealNumber', dealFilter.searchDealNumber != null ? dealFilter.searchDealNumber : "");
        urlDealQuery.set('searchDealName', dealFilter.searchDealName);
        urlDealQuery.set('searchPartnerName', dealFilter.searchPartnerName != null ? dealFilter.searchPartnerName : "");
        let categoryDepth1 = categoryDepth1Items.find(cat => cat.cateNo == dealFilter.categoryDepth1);
        let categoryDepth2 = categoryDepth2Items.find(cat => cat.cateNo == dealFilter.categoryDepth2);
        let categoryDepth3 = categoryDepth3Items.find(cat => cat.cateNo == dealFilter.categoryDepth3);
        urlDealQuery.set('categoryDepth1', (categoryDepth1 != null && categoryDepth1 != undefined ? categoryDepth1.cateName : ""));
        urlDealQuery.set('categoryDepth2', (categoryDepth2 != null && categoryDepth2 != undefined ? categoryDepth2.cateName : ""));
        urlDealQuery.set('categoryDepth3', (categoryDepth3 != null && categoryDepth3 != undefined ? categoryDepth3.cateName : ""));

        if (dealFilter.coId != null && dealFilter.coId.length > 0) {
            urlDealQuery.set('coId', dealFilter.coId.toString())
        } else
            urlDealQuery.set('coId', '');

        if (pageRequest != null) {
            urlDealQuery.set('page', pageRequest.page.toString());
            if (dealFilter.pageLimit) {
                urlDealQuery.set('limit', dealFilter.pageLimit.toString());
            } else
                urlDealQuery.set('limit', pageRequest.size.toString());
        }

        if(dealFilter.typeSale != null)
            urlDealQuery.set('typeSale', dealFilter.typeSale.toString())

        if (dealFilter.sort != null && dealFilter.sort !== 'undefined') {
            urlDealQuery.set('sort', dealFilter.sort.toString());
        }
        console.log(DealService.DEAL_SALES_URL);
        console.log(urlDealQuery.toString());
        return this.apiService.getRaw(DealService.DEAL_SALES_URL, urlDealQuery).map(resp => {

            // let pageResponse = resp as ServerResponse;
            return resp;
        }).catch(error => Observable.throw(error))
    }

    exportDealSalesToExcel(dealFilter: DealSaleFilter, categoryDepth1Items : CompCategoryOnDepth[], categoryDepth2Items : CompCategoryOnDepth[], categoryDepth3Items : CompCategoryOnDepth[], pageRequest: PageRequest) {

        let params = "";

        let userId = window.localStorage.getItem('username');

        params += '?userId=' + userId;

        if (dealFilter.startDate != null) {

            params += '&startDate=' + dealFilter.startDate.formatted;
        }
        if (dealFilter.endDate != null) {
            params += '&endDate=' + dealFilter.endDate.formatted;
        }
        if (dealFilter.departmentId != null && dealFilter.departmentId.length > 0) {
            params += '&cat1=' + dealFilter.departmentId;
        } else
            params += '&cat1=' + '';

        if (dealFilter.teamId != null && dealFilter.teamId.length > 0) {
            params += '&cat2=' + dealFilter.teamId;
        } else
            params += '&cat2=' + '';

        let pageNumber = pageRequest.page;
        if (pageRequest != null) {
            if (pageRequest.page !== 0) {
                pageNumber = pageRequest.page - 1;
            }
            params += "&page=0" ; //MDPORTAL-59 + pageNumber.toString();
            params += "&limit=3000";
            // if (dealFilter.pageLimit) {
            //     params += "&limit=" + dealFilter.pageLimit.toString();
            // } else
            //     params += "&limit=" + pageRequest.size.toString();
        }

        params += '&searchDealNumber=' + dealFilter.searchDealNumber.toString();
        params += '&searchDealName=' + dealFilter.searchDealName.toString();
        let categoryDepth1 = categoryDepth1Items.find(cat => cat.cateNo == dealFilter.categoryDepth1);
        let categoryDepth2 = categoryDepth2Items.find(cat => cat.cateNo == dealFilter.categoryDepth2);
        let categoryDepth3 = categoryDepth3Items.find(cat => cat.cateNo == dealFilter.categoryDepth3);
        params += '&categoryDepth1=' + (categoryDepth1 != null && categoryDepth1 != undefined ? categoryDepth1.cateName : "");
        params += '&categoryDepth2=' + (categoryDepth2 != null && categoryDepth2 != undefined ? categoryDepth2.cateName : "");
        params += '&categoryDepth3=' + (categoryDepth3 != null && categoryDepth3 != undefined ? categoryDepth3.cateName : "");

        if (dealFilter.sort != null && dealFilter.sort !== 'undefined') {
            params += '&sort=' + dealFilter.sort.toString();
        }

        if(dealFilter.typeSale != null){
            params += '&typeSale=' + dealFilter.typeSale.toString();
        }

        if (dealFilter.coId != null && dealFilter.coId.length > 0) {
            params += '&coId=' + dealFilter.coId;
        } else
            params += '&coId=' + '';

        let url = DealService.DEAL_SALES_EXCEL_EXPORT_URL + params;
        console.log(url);
        //open new tab(blank page) for downloading
        window.open('');

        this.apiService.downloadExcelFile(url);

    }

    getDealDealListDetails(searchFilter: DealSaleFilter, pageRequest: PageRequest): Observable<any> {


        let urlDealQuery: URLSearchParams = new URLSearchParams();

        if (searchFilter.startDate != null) {

            urlDealQuery.set('startDate', searchFilter.startDate.formatted)
        }
        if (searchFilter.endDate != null) {
            urlDealQuery.set('endDate', searchFilter.endDate.formatted)
        }
        if (searchFilter.departmentId != null && searchFilter.departmentId.length > 0) {
            urlDealQuery.set('cat1', searchFilter.departmentId)
        } else
            urlDealQuery.set('cat1', '');

        if (searchFilter.teamId != null && searchFilter.teamId.length > 0) {
            urlDealQuery.set('cat2', searchFilter.teamId)
        } else
            urlDealQuery.set('cat2', '');

        urlDealQuery.set('searchDealNumber', searchFilter.searchDealNumber);
        urlDealQuery.set('searchDealName', searchFilter.searchDealName);

        if (pageRequest != null) {
            urlDealQuery.set('page', pageRequest.page.toString());
            if (searchFilter.pageLimit) {
                urlDealQuery.set('limit', searchFilter.pageLimit.toString());
            } else
                urlDealQuery.set('limit', pageRequest.size.toString());
        }

        return this.apiService.getRaw(DealService.DEAL_SALE_DETAIL_URL, urlDealQuery).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))

    }

    getListDealOption(coId: string, dealId: string): Observable<any> {

        let urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set("coId", coId);
        urlParams.set("dealId", dealId);

        return this.apiService.getRaw(DealService.DEAL_OPTION_URL, urlParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    onLoadCategoryDepth(filter: DealSaleFilter, atDepth: number, compCatNo: string): Observable<any> {

        let searchParams: URLSearchParams = new URLSearchParams();


        searchParams.set('fromDateTime', filter.startDate.formatted);
        searchParams.set('toDateTime', filter.endDate.formatted);

        if (filter.coId != null && filter.coId !== '') {
            searchParams.set("coId", filter.coId);
        }

        if (compCatNo != null && compCatNo !== '') {
            searchParams.set("compCatNo", compCatNo);
        }
        if (filter.departmentId != null && filter.departmentId != undefined) {
            searchParams.set("department", filter.departmentId);
        }
        if (filter.teamId != null && filter.teamId != undefined) {
            searchParams.set("team", filter.teamId);
        }
        if (atDepth !=null) {
            searchParams.set('atDepth', atDepth.toString());
        }
        return this.apiService.getRaw(DealService.GET_CATEGORY_DEPTH_FILTER, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))

    }

}

