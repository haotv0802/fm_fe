import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Login} from '../models/login';
import {Observable} from 'rxjs/Observable';
import {ApplicationConstants} from "../../constant/application-constants";
import {CookieService} from "ngx-cookie";

const LOGIN = "api/login";

@Injectable()
export class LoginService {

    constructor(public apiService: ApiService,
                private cookieService: CookieService) {
    }

    public login(login: Login): Observable<any> {
        this.cookieService.remove(ApplicationConstants.COOKIE_AUTH_KEY);
        return this.apiService.post(LOGIN, login);
    }

}