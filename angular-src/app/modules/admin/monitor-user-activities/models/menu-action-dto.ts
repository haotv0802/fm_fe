import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";


export class MenuActionDto {
    public searchPeriod: string;
    public menuName: string;
    public menuCode: string;
    public totalMenuCount?: number;
    public totalButtonCount?: number;
    public searchCount?: number;
    public downloadCount?: number;
    public etcCount?: number;
}

export class MenuActionServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: MenuActionDto[];
}

export class MenuActivitiesPerRow {
    public searchPeriod: string;
    public menuName: string;
    public menuCode: string;
    public totalMenuCount?: number;
    public totalButtonCount?: number;
    public searchCount?: number;
    public downloadCount?: number;
    public etcCount?: number;
}