import {HttpStatus, ServerResponse} from "./server-response";
import {DealOption} from "../../modules/deal/models/deal-option";

export class Option {
    constructor(
        public coDealId?: string,
        public instantId?: string,
        public regDate?: string,
        public status?: string,
        public optionId?: string,
        public coId?: string,
        public dealId?: string,
        public coDealSrl?: string
    ){};
}

export class CompetitorSalesOption{
    constructor(
        public coDealId: string,
        public instantId: string,
        public regDate: Date,
        public saleDiff: string,
        public sellCountDiff: string,
        public sellCountCor: string,
        public salesCor: string,
        public optionId: string
    ){};
}
export class ComptitorSalesAndOptions {
    options: DealOption[];
    salesOptions: CompetitorSalesOption[];
}

export class ComptitorSalesAndOptionsResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: ComptitorSalesAndOptions;
}