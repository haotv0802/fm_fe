import {HttpStatus, ServerResponse} from "../../../shared/models/server-response";
import {DealSale} from "../../deal/models/deal-sale";
import { IMyDateModel } from 'mydatepicker';
import { createIMyDateModel, getFirstDateOfMonth, getLastDateOfMonth } from "../../../shared/utils";
import { BaseModel } from "../../../shared/models/base-model";

export class SummaryViewByCompetitor {
    constructor(public time?: TimeValue,
                public shares? : Array<Share>,
                public summaryArray?: Array<SummaryByCompetitor>,
                public totalSales?: number) {}
}

export class SummaryViewByCategory {
    constructor(public time?: TimeValue,
                public summaryArray?: Array<SummaryByCategory>,
                public totalSales?: number) {}
}



export class TimeValue {
    constructor(public timeStr?: string, public timeUnit?: string) {}
}

export class Share {
    constructor(public coId? :string,
                public percent? : number) {}
}

export class SummaryByCompetitor {
    constructor(public coId?:string,
                public sumAll?: number,
                public summaries?: Array<CategorySummaryItem>) {}
}


export class SummaryByCategory {
    constructor(public categoryNo?:string,
                public sumAll?: number,
                public percent?: number | string | undefined,
                public summaries?: Array<CategorySummaryItem>) {}
}

export enum SummaryCategoryType {
    Group,
    Leaf
}
//request response
//sum all sales response
export class SumAllSalesResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: SummaryTotalSales[];

}

export class SummaryTotalSales {
    constructor(public coId?: string,
                public categoryNo?: number,
                public sumSales?:number,
                ) {}
}
// forecast sales response
export class ForecastSalesResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: ForecastSales[];

}

export class ForecastSales {
    constructor(public coId?: string,
                public categoryNo?: number,
                public forecastSales?:number) {}
}

// total records response
export class TotalCompetitorByCategoryResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: number;

}

// category group in detail response
export class CategoryGroupsInDetailResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: Array<CategoryGroupsInDetail>;

}

export class CategoryGroupsInDetail {
    constructor(public cateNo?: number, public childs?: Array<Category>) {}
}

export class Category {
    constructor(public cateNo?: number,public name?: string) {}
}

//competitor by group category response
export class CompetitorByCategoryResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: Array<CategorySummaryPerDateUnit>;

}
export class CategorySummaryPerCompetitor {
    constructor(public coId?: string,
                public items?: Array<CategorySummaryItem>) {}
}

export class CategorySummaryPerDateUnit {
     constructor(public fromDate?: string,
                 public toDate?:string,
                 public dateUnit?:string,
                 public summaries?: Array<CategorySummaryPerCompetitor>) {}
}

export class CategorySummaryItem {
    constructor(public coId?:string,
                public categoryTitle?:string,
                public categoryNo?:number,
                public date?: string,
                public sales?: number,
                public salesCor?: number,
                public errorCnt?: number,
                public lostCnt?: number,
                public saleRev?: number,
                public cancel?: boolean,
                ) {}
}

export class CompetitorByCategoryFilter extends BaseModel {

    startDate: IMyDateModel;
    endDate: IMyDateModel;
    baseDate: string;
    coIds: string[];
    categoriesNo: number[];
    dateUnit: string;
    currencyUnit: string;
    departmentId: string;
    teamId: string;

    constructor() {
        super();
        this.startDate = createIMyDateModel(getFirstDateOfMonth());
        this.endDate = createIMyDateModel(getLastDateOfMonth());
        this.baseDate = 'saledate';
        this.dateUnit = 'daily';
        this.currencyUnit = 'w';
        this.departmentId = '';
        this.teamId = '';
        this.coIds = ['tmn', 'wmp'];
        this.categoriesNo = [];
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

export class CompetitorByCategoryFilterRequest {

    constructor(public startDate:IMyDateModel,
                public endDate: IMyDateModel,
                public categoriesNo: number[],
                public coIds: string[],
                public dateUnit: string,
                public baseDate:string = 'saledate') {

    }

}
export class ContentsAtCompetitorView {
    contents: object[];
    sumSales: object;
    forecastSales: object;
}

export class ContentsAtCatgeoryView {
    contents: object[];
    sumSales: object;
    forecastSales: object;
}