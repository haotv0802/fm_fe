import {Injectable} from "@angular/core";
import {Constants} from "../../common/constant";
import {HTTPService} from "../../common/HTTP.service";
import {Individual} from "./individual";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class IndividualUpdateService {

  public individual: Individual;

  constructor(
    private _http: Http,
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  // isUserNameExisting(username: string) {
  //   return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_USERNAME_CHECK_SERVICE_URL + username)
  //     .map((res) => res.json())
  //     ;
  // }

  isUserNameExisting(oldUserName: string, userName: string): Observable<any> {
    let params:URLSearchParams = new URLSearchParams();
    params.set("oldUserName", oldUserName);
    params.set("userName", userName);

    return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_USERNAME_CHECK_SERVICE_URL, params)
      .map((res) => res.json())
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      ;
  }
}
