import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Observable} from "rxjs/Observable";
import {Register} from "../models/register";
import {Login} from "../models/login";
import {URLSearchParams} from "@angular/http";
import {CookieService} from "ngx-cookie";
const POST_AUTHORITY_INFO = "/api/checkAuthority";
const POST_REQUEST_AUTHORIZATION = "/api/requestAuthority";
const POST_CHANGE_AUTHORIZATION = "/api/requestChangeAuthority";
const RECORD_USER_CLICK = "/api/monitor/userClick";
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, public apiService: ApiService, private cookieService: CookieService) {
    }

    canActivate(): boolean {
        if (window.localStorage.getItem('authenticated') == null) {
            this.router.navigate(['/login']);
            return false;
        }

        return true;
    }

    getAuthorityInfo(login: Login): Observable<any> {
        return this.apiService.postRaw(POST_AUTHORITY_INFO, login).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    recordUserClick(menuItem: string): Observable<any> {
        const searchParams: URLSearchParams = new URLSearchParams();
        let username = window.localStorage.getItem('username');
        searchParams.set('userId', username);
        searchParams.set('menuItem', menuItem);
        return this.apiService.get(RECORD_USER_CLICK, searchParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    postRequestAuthorization(register: Register): Observable<any> {
        return this.apiService.postRaw(POST_REQUEST_AUTHORIZATION, register).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    postChangeAuthorization(register: Register): Observable<any> {
        return this.apiService.postRaw(POST_CHANGE_AUTHORIZATION, register).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }
}