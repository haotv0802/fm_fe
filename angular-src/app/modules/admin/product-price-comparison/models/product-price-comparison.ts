import {IMyDateModel} from "mydatepicker";
import {BaseModel} from "../../../../shared/models/base-model";
import {createIMyDateModel, getCurrentDate} from "../../../../shared/utils";

export class ProductPriceComparisonFilter extends BaseModel{
    startDate: IMyDateModel;
    hourAtStartDate: string;
    minuteAtStartDate: string;

    endDate: IMyDateModel;
    hourAtEndDate: string;
    minuteAtEndDate: string;

    categoryDepth1:string;
    categoryDepth2:string;
    categoryDepth3:string;

    coId:string;
    dealName: string;

    constructor() {
        super();
        this.startDate = createIMyDateModel(getCurrentDate());
        this.hourAtStartDate ='';
        this.minuteAtStartDate ='';

        this.endDate = createIMyDateModel(getCurrentDate());
        this.hourAtEndDate ='';
        this.minuteAtEndDate ='';

        this.categoryDepth1 = '';
        this.categoryDepth2 = '';
        this.categoryDepth3 = '';
        this.coId = 'gmrk';
        this.dealName = '';

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