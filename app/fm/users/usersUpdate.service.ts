import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {User} from "./user";
import {Constants} from "../../common/constant";
import {HTTPService} from "../../common/HTTP.service";
import {KeyValuePair} from "../../common/keyValuePair";

@Injectable()
export class UsersUpdateService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants
  ) {
  }

  getUsers(): Observable<User[]> {
    // let headers = new Headers();
    //
    // headers.append("Accept-Language", "en");
    // headers.append("Content-Type", "application/json");
    // headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
    //
    // return this._http.get(this._constants.ADMIN_USERS_SERVICE_URL, {headers: headers})
    //   .map((res) => { return <User[]> res.json(); })
    //   .catch(this.handleError)
    // ;
    return this._httpService.get(this._constants.ADMIN_USERS_SERVICE_URL)
      .map((res) => { return <User[]> res.json(); })
      ;
  }

  getRolesInfo(): Observable<KeyValuePair[]> {
    return this._httpService.get(this._constants.ADMIN_ROLES_KEYVALUE_SERVICE_URL)
      .map((res) => { return <KeyValuePair[]> res.json(); })
      ;
  }

  updateUsersRoles(users: User[]): Observable<any> {
    return this._httpService.patch(this._constants.ADMIN_USERS_ROLES_UPDATE_SERVICE_URL, users)
    ;
  }
}