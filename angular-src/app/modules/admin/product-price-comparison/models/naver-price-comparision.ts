import {IMyDateModel} from "mydatepicker";
import {BaseModel} from "../../../../shared/models/base-model";
import {createIMyDateModel, getCurrentDate} from "../../../../shared/utils";
import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";

export class NaverPriceComparisonFilter extends BaseModel {
    searchDate: IMyDateModel;
    cat1: string;
    cat2: string;
    productName: string;


    constructor() {
        super();
        this.searchDate = createIMyDateModel(getCurrentDate());
        this.cat1 = '';
        this.cat2 = '';
        this.productName = '';
    }

    getPropValue(prop) {
        if (prop === 'searchDate') {
            return this.searchDate.formatted;

        }

        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
        if (prop === 'searchDate') {
            this[prop] = createIMyDateModel(new Date(value));
        } else {
            super.setPropValue(prop, value);
        }
    }

}

export class NaverPriceComparisionDTO {
    public TMON_SELLER_NAME?:string = "티몬" ;
    public nvMid?:number;
    public cat1?: string;
    public cat2?: string;
    public regdate?: IMyDateModel;
    public updatedDate?: IMyDateModel;
    public createdDate?: IMyDateModel;
    public productRank?: number;
    public naverUrl?: string;
    public seller1?: string;
    public dealId1?:number;
    public title1?: string;
    public price1?: number;
    public mainUrl1?: string;
    public deliveryFee1?: string;
    public position1?: number;
    //
    public seller2?: string;
    public dealId2?: number;
    public title2?: string;
    public price2?: number;
    public mainUrl2?: string;
    public deliveryFee2?: string;
    public position2?: number;
    public naverTitle?: string;
}

export class NaverCategoryDTO {
    public regdate?: IMyDateModel;
    public cat1CodeUnmapped?: string;
    public cat2CodeUnmapped?: string[];
    public cat1StrUnmapped?: string;
    public cat2StrUnmapped?: string[];
    public keywords?: string;
    public brands?: string;
}

export class Pagination {
    public total?: number;
    public limit?: number;
    public page?: number;
}

export class NaverPriceComparisionWithPagination {
    public data?: NaverPriceComparisionDTO[];
    public pagination?: Pagination;
}

export class NaverPriceComparisionResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: NaverPriceComparisionWithPagination;
}

export class NaverCategoryResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: NaverCategoryDTO[];
}