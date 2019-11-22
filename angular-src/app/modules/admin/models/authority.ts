import {BaseModel} from "../../../shared/models/base-model";
import {ApplicationConstants} from "../../../constant/application-constants";
import {AppliedSystem} from "../../../shared/models/register";

export class AuthorityRequest {
    constructor(public srl: number,
                public userId: string,
                public userName: string,
                public categoryVersion: string,
                public authorityRequests: CategoryRequest[],
                public categoryAuthorities: number[],
                public pageAuthRequests: PageAuthRequest[],
                public pageIds: string[],
                public status: string,
                public pageAuthority: string,
                public department: string,
                public isChecked: boolean,
                public userMemo?: string,
                public adminMemo?: string,
                public returned?: string,
                public isReturnedCheck?: boolean,
                public appliedToSystem?: number,
                public updater?: string,
                public updatedTime?: string,
                public snoopy2Storate?: boolean,
                ) {
        this.isReturnedCheck = false;
        this.appliedToSystem = AppliedSystem.SNOOPY1_SNOOPY2;
    }
}

export class AuthorityRequestUpdate {
    constructor(public srl: number,
                public userId: string,
                public userName: string,
                public categoryVersion: string,
                public authorityRequests: CategoryRequest[],
                public categoryAuthorities: number[],
                public pageAuthRequests: PageAuthRequest[],
                public pageIds: string[],
                public status: string,
                public pageAuthority: string,
                public department: string,
                public adminMemo?: string,
                public userMemo?: string,
                public returned?: string,
                public appliedToSystem?: number,
                public updater?: string,
                public updatedTime?: string,
    ) {
    }
}

export class CategoryRequest {
    constructor(public no: number,
                public name: string,
                public checked: boolean
    ) {

    }
}

export class PageAuthRequest {
    constructor(public no: number,
                public name: string,
                public checked: boolean
    ) {

    }
}

export class  AuthorityRequestFilter extends BaseModel {

    /**
     * setting default value
     */
    constructor() {
        super();
    }

    getPropValue(prop) {
        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
       super.setPropValue(prop, value);
    }
}



export class  AuthorityListFilter extends BaseModel {
    userId: string;
    userName: string;
    orgVer: string;
    authority: string;
    department: string;
    status: string;

    /**
     * setting default value
     */
    constructor() {
        super();
    }

    getPropValue(prop) {
        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
        super.setPropValue(prop, value);
    }
}