import { IMyDateModel } from "mydatepicker"

import { BaseModel } from '../../../shared/models/base-model';
import { getFirstDateOfMonth, getLastDateOfMonth, createIMyDateModel } from '../../../shared/utils';

export class DealAreaFilter extends BaseModel {
    dealSrl?: string;
    competitor?: string;
    startDate?: IMyDateModel;
    endDate?: IMyDateModel;
    confirm?: string;
    area: boolean;
    keyword?: string;

    constructor() {
        super();
        this.competitor = 'cpn2';
        this.keyword = '';
        this.confirm = '';
        this.area = false;
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
        return ['dealSrl'];
    }
}

export class AreaFilter extends BaseModel {
    depart?: string;
    keyword?: string;
    region: string;

    constructor() {
        super();
        this.keyword = '';
        this.depart = '';
        this.region = '';
    }
}

export class Area {
    areaNo: number;
    regionNo: number;
    departName: string;
    groupName: string;
    address: string;
    tokenCount: number;
    createdAt: string;
    updatedAt: string;
}