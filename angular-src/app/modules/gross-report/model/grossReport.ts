import {BaseModel} from "../../../shared/models/base-model";
import {IMyDateModel} from "mydatepicker";
import {createIMyDateModel, getFirstDateOfMonth, getLastDateOfMonth} from "../../../shared/utils/index";

export class GrossReport {
    constructor(public saleDate: string,
                public coId: string,
                public msCat1Title: string,
                public msCat2Title: string,
                public orgCat1: string,
                public orgCat2: string,
                public sumSales: number,
                public coName: string,
                public orgCat3: string,
                public orgCat4: string,
    ) {
    }
}

export class GrossReportFilter extends BaseModel {
    coId: string;
    startDate: IMyDateModel;
    endDate: IMyDateModel;
    sort: string;
    departmentId: string;
    teamId: string;

    /**
     * setting default value
     */
    constructor() {
        super();
        this.coId = '';
        this.departmentId = '';
        this.teamId = '';
        this.startDate = createIMyDateModel(getFirstDateOfMonth());
        this.endDate = createIMyDateModel(getLastDateOfMonth());
        this.sort = "sales,desc";
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