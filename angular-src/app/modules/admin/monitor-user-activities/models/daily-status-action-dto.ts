import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";


export class DailyStatusActionDto {
    public day: string;
    public searchPeriod: string;
    public totalMenuCount?: number;
    public menuItems: DailyStatusMenuRow[];
    public totalButtonCount?: number;
    public searchCount?: number;
    public downloadCount?: number;
    public etcCount?: number;
}

export class DailyStatusActionServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: DailyStatusActionDto[];
}

export class DailyStatusMenuRow {
    public name?: string;
    public count?: number;
}

export class DailyStatusRow {
    public day: string;
    public searchPeriod: string;
    public totalMenuCount?: number;
    public totalButtonCount?: number;
    public searchCount?: number;
    public downloadCount?: number;
    public etcCount?: number;
    /*Menu */
    public menu1?: number;
    public menu2?: number;
    public menu3?: number;
    public menu4?: number;
    public menu5?: number;
    public menu6?: number;
}

export class ChartValue {
    public xDate: Date;
    public countValue?: number;
}

export enum GraphType {
    Org = <any>"일 접속자수", Team = <any>"일별 #력수"
}