import {IMyDateModel} from "mydatepicker"

import {HttpStatus, ServerResponse} from "../../../shared/models/server-response";
import {BaseModel} from '../../../shared/models/base-model';
import {getFirstDateOfMonth, getLastDateOfMonth, createIMyDateModel, getCurrentDate} from '../../../shared/utils';

export class DealSale {
    constructor(public startDate?: Date,
                public endDate?: Date,
                public corpId?: string,
                public msCat1Title?: string,
                public msCat2Title?: string,
                public regionGroup?:string,
                public zeroDeal?:string,
                public dealId?: string,
                public coDealId?: string,
                public title?: string,
                public url?: string,
                public priceOrigin?: number,
                public discount?: number,
                public priceNow?: number,
                public sellCount?: number,
                public minCount?: number,
                public maxCount?: number,
                public totalSales?: number,
                public error?: boolean,
                public salesCor?: number,
                public saleCor2?: number,
                public orgCat1?: string,
                public orgCat2?: string,
                public orgCat3?: string,
                public shopName?: string,
                public shopTel?: string,
                public shopAddress?: string,
                public sales?: number,
                public area1?: string,
                public class1?: string,
                public categoryNo?: number,
                public class2?: string,
                public category?: string,
                public class3?: string,
                public class4?: string) {
    }
}

export class DealerSaleInfo {
    constructor(public name?: string,
                public totalSales?: number,
                public countNew?: number,
                public totalDeals?: number
    ) {}

}

export class DealSaleCategory {
    name: string;
    totalSales: number;
    countNew: number;
    totalDeals: number;
    items: DealSale[]

}

export class CompCategoryOnDepth {
    coId?: string;
    cateName?: string;
    cateNo?: string;
    depth?: string;
}

export class CompCategoryOnDepthResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: CompCategoryOnDepth[];
    public pagination: {
        total: number,
        limit: number,
        page: number
    }
}

export class DealSaleCategoryPageResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: DealSaleCategory[];
    public pagination: {
        total: number,
        limit: number,
        page: number
    }
}

export class DealSalePageResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: DealSale[];
    public pagination: {
        total: number,
        limit: number,
        page: number
    }
}

export class DealSaleFilter extends BaseModel {
    startDate: IMyDateModel;
    endDate: IMyDateModel;
    searchDealNumber: string;
    searchDealName: string;
    searchPartnerName: string;
    departmentId: string;
    departmentName: string;
    teamId: string;
    teamName: string;
    sort: string;
    pageLimit: number;
    coId: string;
    typeSale: number;
    categoryDepth1:string;
    categoryDepth2:string;
    categoryDepth3:string;
    userRole:string;
    userId:string;
    isFullAccess:boolean;

    /**
     * setting default value
     */
    constructor() {
        super();
        this.searchDealName = '';
        this.searchDealNumber = '';
        this.searchPartnerName="";
        this.departmentId = '';
        this.teamId = '';
        this.pageLimit = 100;
        this.coId = '';
        this.typeSale = 1;
        this.startDate = createIMyDateModel(getCurrentDate());
        this.endDate = createIMyDateModel(getCurrentDate());
        this.categoryDepth1 = '';
        this.categoryDepth2 = '';
        this.categoryDepth3 = '';
        this.userRole = '';
        this.userId= '';
        this.isFullAccess = false;
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

    getIgnoreProps() {
        return ['viewCorrected'];
    }
}

