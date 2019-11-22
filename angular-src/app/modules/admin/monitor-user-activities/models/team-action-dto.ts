import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";


export class DetailedTeamActionDto {
    public searchPeriod: string;
    public menuName: string;
    public teamName: string;
    public menuCode: string;
    public userCount: number;
    public totalMenuCount?: number;
    public menuItems: DetailedTeamMenuRow[];
    public totalButtonCount?: number;
    public searchCount?: number;
    public downloadCount?: number;
    public etcCount?: number;
}

export class DetailedTeamActionServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: DetailedTeamActionDto[];
}

export class DetailedTeamMenuRow {
    public name?: string;
    public count?: number;
}

export class DetailedTeamRow {
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
}