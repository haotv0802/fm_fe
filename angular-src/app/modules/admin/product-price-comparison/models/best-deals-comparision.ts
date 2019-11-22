import {IMyDateModel} from "mydatepicker";
import {BaseModel} from "../../../../shared/models/base-model";
import {createIMyDateModel, getCurrentDate} from "../../../../shared/utils";
import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";
import {ProductHistoryDTO} from "./product-history-report";

export class BestDealComparisonFilter extends BaseModel {
    fromDateTime: IMyDateModel;
    hourAtStartDate: string;

    toDateTime: IMyDateModel;
    hourAtEndDate: string;

    dealName: string;

    isShowCategory: boolean;
    isShowDealNo: boolean;


    constructor() {
        super();
        this.fromDateTime = createIMyDateModel(getCurrentDate());
        this.hourAtStartDate ='';

        this.toDateTime = createIMyDateModel(getCurrentDate());
        this.hourAtEndDate ='';
        this.dealName = '';
        this.isShowCategory = false;
        this.isShowDealNo = false;
    }

    getPropValue(prop) {
        if (prop === 'searchDate') {
            return this.fromDateTime.formatted;

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

export class BestDealComparisionDTO {
    public prodHisByRank?: Map<number, Map<string, ProductHistoryDTO[]>>;
    constructor() {
        this.prodHisByRank = new Map();

    }
}

export class BestDealsComparisionResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: BestDealComparisionDTO;
}