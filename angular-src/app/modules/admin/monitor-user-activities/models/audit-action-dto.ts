import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";


export class AuditActionDto {
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

export class AuditActionServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: AuditActionDto[];
}


export class AuditActionTableRow {
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
