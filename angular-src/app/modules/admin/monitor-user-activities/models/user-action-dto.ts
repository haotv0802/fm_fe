import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";


export class DetailedUserActionDto {
    public searchPeriod: string;
    public menuName: string;
    public teamName: string;
    public menuCode: string;
    public userCount: number;
    public totalMenuCount?: number;
    public menuItems: DetailedUserMenuRow[];
    public totalButtonCount?: number;
    public searchCount?: number;
    public downloadCount?: number;
    public etcCount?: number;

    public userName:string;
    public userId:string;
    public menuAndTab:string;
    public time:string;
    public buttonName:string;
}

export class UserActionDto {
    public userId: string;
    public userName: string;
}

export class TeamActionDto {
    public department: string;
    public users: UserActionDto[];
}

export class DetailedUserActionServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: DetailedUserActionDto[];
}

export class TeamAndUserServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: TeamActionDto[];
}

export class DetailedUserMenuRow {
    public name?: string;
    public count?: number;
}



export class DetailedUserRow {
    public searchPeriod: string;
    public menuName: string;
    public teamName: string;
    public menuCode: string;
    public userCount: number;
    public totalMenuCount?: number;
    public totalButtonCount?: number;
    public searchCount?: number;
    public downloadCount?: number;
    public etcCount?: number;

    public userName: string;
    public ad: string ;
    public menuAndTab: string;
    public time: string;
    public buttonName: string;
}