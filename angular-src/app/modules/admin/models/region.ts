import { BaseModel } from '../../../shared/models/base-model';

export class RegionFilter extends BaseModel {
    depart?: string;
    used?: string;
    keyword?: string;

    constructor() {
        super();
        this.keyword = '';
        this.used = '';
        this.depart = '';
    }
}

export class Region {
    regionNo: number;
    departName: string;
    groupName: string;
    name: string;
    used: string;

    createdAt: string;
    updatedAt: string;
}