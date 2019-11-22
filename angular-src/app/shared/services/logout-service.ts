import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Observable} from "rxjs/Observable";
import {Login} from "../models/login";

const LOGOUT = "/api/logout";

@Injectable()
export class LogoutService {
    constructor(public apiService: ApiService) {
    }

    public logout(): Observable<any> {
        return this.apiService.post(LOGOUT, null);
    }
}
