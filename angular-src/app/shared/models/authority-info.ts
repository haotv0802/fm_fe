import {HttpStatus, ServerResponse} from "./server-response";
import {Department} from "./register";

export class AuthorityInfo {
    constructor(public role?: string,
                public version?: string,
                public authority?: boolean,
                public departments: Department[] = [],
                public assignedCategories?: string,
                public fullName?: string,
                public currentDepartment?: Department,
                public used?: string,
                public pageAuthorities?: any
                ) {
    };
}

export class AuthorityInfoResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: AuthorityInfo;
}