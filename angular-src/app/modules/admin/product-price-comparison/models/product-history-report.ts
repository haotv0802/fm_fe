import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";


export class ProductHistoryDTO {
    public coId?: string;
    public categoryNo?: string;
    public productCode?: number;
    public priceOrigin?: number;
    public priceNow?: number;
    public priceGap?: number;

    public deliveryInfo?: string;
    public remark?: string;
    public rank?: string;
    public rankGap?: string;

    public partnerInfo?: PartnerInfoDTO;
    public name?: string;
    public cat1Name?: string;
    public cat2Name?: string;
    public cat3Name?: string;
    public createdAt?: string;
    public url?: string;
    public sellCount?: number;
    public sellCountGap?: number;
    public point?: number;
    public totalPoint?: number;
}


export class PartnerInfoDTO {
    public name?: string;
    public phoneNumber?: string;
    public bussinessNumber?: string;
}


export class TmonDealOptionDTO {
    public title?: string;
    public priceOrigin?: string;
    public priceNow?: string;

}

export class ProductHistoryReportsServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: ProductHistoryDTO[];
}

export class ProductHistoryDetailsServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: ProductHistoryDTO[];
}



export class ProductHistoryMatchingTableRow {
    public no?: number;
    public rank?: string;
    public rankGap?:string;
    public date?: string;
    public competitorName?: string;
    public coId?: string;
    public category1?: string;
    public category2?: string;
    public category3?: string;
    public dealId?: number;
    public dealName?: string;
    public dealURL?: string;
    public deliveryInfo?: string;
    public priceOrigin?: number;
    public priceNow?: number;
    public priceGap?: number;
    public sellCount?: number;
    public sellCountGap?: number;
    public partnerName?: string;
    public partnerPhone?: string;
    public partnerBusinessNo?: string;

    public totalPoint?: number;

}
export class CategoryDepth{
    public coId?: string;
    public cateName?: string;
    public cateNo?: string;
    public depth?: string;
}

export enum CategoryDepthEnum {
    Depth0, Depth1, Depth2, Depth3
}