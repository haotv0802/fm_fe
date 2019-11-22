import {Injectable} from "@angular/core";
import {ApiService} from "../../../../shared/services/api.service";
import {Http, URLSearchParams} from "@angular/http";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {Observable} from "rxjs";
import {AuditActionFilter} from "../models/audit-action-model";
import {PageRequest} from "../../../../shared/models/page-request";

const LOAD_DATA_4_SEARCH_DAILY_ACT = 'api/monitor/searchDailyActivities';
const LOAD_DATA_4_DETAILED_MENU_ACT = 'api/monitor/searchMenuActivities';
const LOAD_DATA_4_DETAILED_USER_ACT = 'api/monitor/searchUserActivities';
const LOAD_DATA_4_DETAILED_USER_ACT_DAILY = 'api/monitor/searchDetailedUserActivities';
const LOAD_DATA_4_DETAILED_TEAM_ACT = 'api/monitor/searchTeamActivities';
const LOAD_DATA_4_DETAILED_TEAM_ACT_DAILY = 'api/monitor/searchDetailedTeamActivities';
const LOAD_DATA_OF_TEAM_AND_USER ='api/monitor/searchTeamAndUser';
const EXPORT_EXCEL = 'api/monitor/exporting.xlsx';
export const EMPTY_DEPT_VALUE ='[Empty]' ;
@Injectable()
export class AuditActionService {
    constructor(private apiService: ApiService,
                private http: Http,
                private blockUI: BlockUIService) {
    }

    loadData(filter: AuditActionFilter, pageRequest: PageRequest): Observable<any> {
        let searchParams: URLSearchParams = new URLSearchParams();
        if (filter.typeSearch == "DAILY_STATUS_MONITOR") {
            searchParams.set('fromDate', filter.fromDateTime.formatted);
            searchParams.set('toDate', filter.toDateTime.formatted);
            return this.apiService.getRaw(LOAD_DATA_4_SEARCH_DAILY_ACT, searchParams).map(resp => {
                return resp;
            }).catch(error => Observable.throw(error));
        } else if (filter.typeSearch == "DETAILED_MENU_MONITOR") {
                searchParams.set('fromDate', filter.fromDateTime.formatted);
                searchParams.set('toDate', filter.toDateTime.formatted);
                return this.apiService.getRaw(LOAD_DATA_4_DETAILED_MENU_ACT, searchParams).map(resp => {
                    return resp;
                }).catch(error => Observable.throw(error));
        } else if (filter.typeSearch == "DETAILED_TEAM_MONITOR") {
            searchParams.set('fromDate', filter.fromDateTime.formatted);
            searchParams.set('toDate', filter.toDateTime.formatted);
            searchParams.set('teamId', filter.teamId);
            searchParams.set('menuItem', filter.menuItem);
            return this.apiService.getRaw(LOAD_DATA_4_DETAILED_TEAM_ACT, searchParams).map(resp => {
                return resp;
            }).catch(error => Observable.throw(error));
        } else if (filter.typeSearch == "DETAILED_TEAM_PER_DAY_MONITOR") {
            searchParams.set('fromDate', filter.fromDateTime.formatted);
            searchParams.set('toDate', filter.toDateTime.formatted);
            searchParams.set('teamId', filter.teamId);
            searchParams.set('menuItem', filter.menuItem);
            return this.apiService.getRaw(LOAD_DATA_4_DETAILED_TEAM_ACT_DAILY, searchParams).map(resp => {
                return resp;
            }).catch(error => Observable.throw(error));
        } else if (filter.typeSearch == "DETAILED_USER_MONITOR") {
            searchParams.set('fromDate', filter.fromDateTime.formatted);
            searchParams.set('toDate', filter.toDateTime.formatted);
            searchParams.set('teamId', filter.teamId);
            searchParams.set('menuItem', filter.menuItem);
            searchParams.set('searchUserName', filter.searchUserName);
            searchParams.set('searchUserId', filter.searchUserId);
            return this.apiService.getRaw(LOAD_DATA_4_DETAILED_USER_ACT, searchParams).map(resp => {
                return resp;
            }).catch(error => Observable.throw(error));
        } else if (filter.typeSearch == "DETAILED_USER_PER_DAY_MONITOR") {
            searchParams.set('fromDate', filter.fromDateTime.formatted);
            searchParams.set('toDate', filter.toDateTime.formatted);
            searchParams.set('teamId', filter.teamId);
            searchParams.set('menuItem', filter.menuItem);
            searchParams.set('searchUserName', filter.searchUserName);
            searchParams.set('searchUserId', filter.searchUserId);
            return this.apiService.getRaw(LOAD_DATA_4_DETAILED_USER_ACT_DAILY, searchParams).map(resp => {
                return resp;
            }).catch(error => Observable.throw(error));
        }
    }

    loadTeamAndUsers(): Observable<any> {
        return this.apiService.getRaw(LOAD_DATA_OF_TEAM_AND_USER, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    formatToDateTime(dateStr: string, hours: string) {
        hours = (hours != null && hours != undefined && hours != "") ? hours : '00';
        let timeStr = `${hours}:00:00`;
        return `${dateStr}T${timeStr}`;
    }

}