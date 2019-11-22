import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ApiService} from "./api.service";
import {Option} from "../models/option";
import {URLSearchParams} from "@angular/http";
import {DealSaleFilter} from "../../modules/deal/models/deal-sale";

const UPDATE_IGNORE_OPTION = "api/option/updateIgnore";
const GET_COMPETITOR_SALES_AND_OPTIONS = "api/competitorSalesAndOptions";

@Injectable()
export class OptionService {

    constructor(public apiService: ApiService) {
    }

    updateIgnoreOptions(data: Option): Observable<any> {
        let res = this.apiService.post(UPDATE_IGNORE_OPTION, data);
        return res;
    }

    getCompetitorSalesAndOptions(coId: string, dealId: string, coDealSrl: string, filter: DealSaleFilter, startDate: string, endDate: string): Observable<any> {

        const searchParams: URLSearchParams = new URLSearchParams();

        if (filter.startDate != null) {
            searchParams.set('startDate', filter.startDate.formatted)
        }
        if (filter.endDate != null) {
            searchParams.set('endDate', filter.endDate.formatted)
        }
        searchParams.set("coDealSrl", coDealSrl);
        searchParams.set("coId", coId);
        searchParams.set("dealId", dealId);
        searchParams.set("saleType", filter.typeSale.toString());
        searchParams.set("dealStartDate", startDate);
        searchParams.set("dealEndDate", endDate);

        return this.apiService.getRaw(GET_COMPETITOR_SALES_AND_OPTIONS, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }


}
