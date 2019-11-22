import {Injectable} from "@angular/core";
import {ApiService} from "../../../shared/services/api.service";
import {Observable} from "rxjs/Observable";
import {PageRequest} from "../../../shared/models/page-request";
import {URLSearchParams} from "@angular/http";
import {
    AuthorityListFilter, AuthorityRequest, AuthorityRequestFilter,
    AuthorityRequestUpdate
} from "../models/authority";
import {BlockUIService} from "../../../shared/services/block-ui.service";

@Injectable()
export class AuthorityService {
    public static AUTHORITY_REQUESTS = '/api/authority/approvalRequests';
    public static APPROVE_AUTHORITY_REQUESTS = '/api/authority/approvalRequests/approve';
    public static APPROVE_AUTHORITY_PART_REQUESTS = '/api/authority/approvalRequests/approve';
    public static AUTHORITY_UPDATE = '/api/authority/update';
    public static AUTHORITY_LIST = '/api/authority/list';
    private static EXPORT_EXCEL_URL = 'api/authority/exporting.xlsx';
    private static GET_ACTIVE_USERS = "/api/authority/list";
    constructor(private apiService: ApiService, private blockUI: BlockUIService) {

    }

    exportToExcel(filter: AuthorityListFilter): void {
        let params: URLSearchParams = new URLSearchParams();
        params.set("userId", filter.userId);
        params.set("userName", filter.userName);
        params.set("orgVer", filter.orgVer);
        params.set("authority", filter.authority);
        params.set("department", filter.department);
        params.set("status", filter.status);

        let url = AuthorityService.EXPORT_EXCEL_URL + '?' +params.toString();
        console.info(url);
        window.open('');
        this.apiService.downloadExcelFile(url);

    }

    getAuthorityRequests(authorityRequestFilter: AuthorityRequestFilter, pageRequest: PageRequest): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();

        if (pageRequest != null) {
            params.set('page', pageRequest.page.toString());
            params.set('limit', pageRequest.size.toString());
        }

        return this.apiService.getRaw(AuthorityService.AUTHORITY_REQUESTS, params);
    }

    getAuthorityList(authorityRequestFilter: AuthorityListFilter, pageRequest: PageRequest): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();

        if (pageRequest != null) {
            params.set('page', pageRequest.page.toString());
            params.set('limit', pageRequest.size.toString());
        }

        // if (authorityRequestFilter.sort != null) {
        //     params.set('sort', authorityRequestFilter.sort.toString());
        // }
        params.set("userId", authorityRequestFilter.userId);
        params.set("userName", authorityRequestFilter.userName);
        params.set("orgVer", authorityRequestFilter.orgVer);
        params.set("authority", authorityRequestFilter.authority);
        params.set("department", authorityRequestFilter.department);
        params.set("status", authorityRequestFilter.status);

        return this.apiService.getRaw(AuthorityService.AUTHORITY_LIST, params);
    }

    approveRequests(requests: number[]): Observable<any> {
        return this.apiService.putRaw(AuthorityService.APPROVE_AUTHORITY_REQUESTS, requests);
    }

    approvePartRequests(requests: AuthorityRequestUpdate[]): Observable<any> {
        let username = window.localStorage.getItem("username");
        let url = AuthorityService.APPROVE_AUTHORITY_PART_REQUESTS  + "?currentUserId=" + username;
        return this.apiService.putRaw(url, requests);
    }

    updateAuthorityRequests(authorityRequests: AuthorityRequestUpdate[]): Observable<any> {
        let username = window.localStorage.getItem("username");
        let url = AuthorityService.AUTHORITY_UPDATE + "?currentUserId=" + username;
        return this.apiService.putRaw(url, authorityRequests);
    }

    getActiveUsers(): Observable<any> {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set('page', '0');
        searchParams.set('status', 'Y');
        searchParams.set('limit', '99999');
        return this.apiService.getRaw(AuthorityService.GET_ACTIVE_USERS, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

}