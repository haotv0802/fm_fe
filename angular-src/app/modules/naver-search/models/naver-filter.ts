import {BaseModel} from "../../../shared/models/base-model";

export class NaverFilter extends BaseModel{
    priceFrom: string;
    priceTo: string;
    keyword: string;
    category1: string;
    category2: string;
    categoryId: string;
    searchDate: Date;


    constructor() {
        super();
        let d = new Date();
        this.priceFrom = '';
        this.priceTo = '';
        this.keyword = '';
        this.category1 = '';
        this.category2 = '';
        this.searchDate = d;
    }

    getPropValue(prop) {
        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
        super.setPropValue(prop, value);
    }
}
