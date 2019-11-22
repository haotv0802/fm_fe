import {IMyDateModel} from "mydatepicker";

import {BaseModel} from '../../../shared/models/base-model';
import {createIMyDateModel} from '../../../shared/utils';

export class CategoryFilter extends BaseModel {
    dealSrl?: string;
    competitor?: string;
    startDate?: IMyDateModel;
    endDate?: IMyDateModel;
    confirm?: string;
    category?: string;
    keyword?: string;

    constructor() {
        super();
        this.competitor = 'cpn2';
        this.confirm = '';
        this.category = '';
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

export class Category {
    startDate: string;
    endDate: string;
    title: string;
    categoryNo: string;
    categoryConfrimYN: string;
    categoryModifier: string;
    categoryConfrimer: string;
    categoryModifiedAt: string;
    categoryConfirmAt: string;
    orgCat1: string;
    orgCat2: string;
    orgCat3: string;
    shopName: string;
    shopAddress: string;
}

export enum OrganizationType {
    Org = <any>"Org", Team = <any>"Team"
}

export class Version {
    constructor(public versionCode?: string,
                public versionName?: string) {
    };
}
 export class RenewalOrganizationModel extends Version{
    public currentVersion?: string;
    constructor(public version?: Version){
        super();
    };
 }

export class ParentOrganization extends Version {
    constructor(public code?: number,
                public name?: string) {
        super();
    };
}

export class BaseOrganization extends Version {
    constructor(public type?: OrganizationType,
                public parentOrganizations?: ParentOrganization[]) {
        super();
    };
}

export class Organization extends BaseOrganization {
    constructor(public orgCode?: number,
                public orgName?: string,
                public teamCode?: number,
                public teamName?: string,
                public used?: string,
                public srl?: number) {
        super();
    };
}

export class OrganizationRequest {
    constructor(public organizationsAndTeams?: Organization[],
                public organizations?: ParentOrganization[],
                public versionCode?: string,
                public versionName?: string) {
    };
}
export class RenewalForm{
    constructor(public version?: Version,
                public currentVersionNam?: string){};
}

export class CreateOrgTeamFormModel{
    constructor(public organization?: Organization,
                public orgTeamNameArray?: string[],)
    {};
}