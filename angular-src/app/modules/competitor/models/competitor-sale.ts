import {HttpStatus, ServerResponse} from '../../../shared/models/server-response';
import {DealSale} from '../../deal/models/deal-sale';
import {IMyDateModel} from 'mydatepicker';
import {BaseModel} from "../../../shared/models/base-model";
import {createIMyDateModel, getFirstDateOfMonth, getLastDateOfMonth} from "../../../shared/utils";

export class SaleProvider {
    constructor(public coId: string,
                public saleDate?: Date,
                public saleCor2?: number,
                public salesCor?: number,
                public saleCnt?: number,
                public sales?: number,
                public lostCnt?: number,
                public saleweekday?: string) {

    }
}

export class SaleItem {
    saleDate: string;
    saleWeekDay: string;
    providers: SaleProvider[] = [];
    total: number;
}

export class CompetitorSummaryPageResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: CompetitorSummaryData;

}

export class CompetitorSummaryFilter extends BaseModel{
    typeSale: number;
    startDate: IMyDateModel;
    endDate: IMyDateModel;
    typeSearch: number;
    cat1: string;
    cat2: string;
    unit: string;

    constructor() {
        super();
        this.typeSale = 1;
        this.typeSearch = 0;
        this.unit = 'DAILY';
        this.cat1 = '';
        this.cat2 = '';
        this.startDate = createIMyDateModel(getFirstDateOfMonth());
        this.endDate = createIMyDateModel(getLastDateOfMonth());
    }

    getPropValue(prop) {
        if (prop === 'startDate') {
            return this.startDate.formatted;

        } else if (prop === 'endDate') {
            return this.endDate.formatted;
        }

        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
        if (prop === 'startDate' || prop === 'endDate') {
            this[prop] = createIMyDateModel(new Date(value));
        } else {
            super.setPropValue(prop, value);
        }
    }
}

export class CompetitorSummaryData {
    items: any;
    sales: SaleProvider[] = [];
    total: number;
    forecast: any;
}


