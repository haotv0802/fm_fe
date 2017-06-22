import {Injectable} from "@angular/core";
import {Credential} from "./credential";
import {Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Constants} from "./../constant";
import {HTTPService} from "../HTTP.service";

@Injectable()
export class LoginService {

  constructor(
    private _constants: Constants,
    private _httpService: HTTPService) {
  }

  login(credential: Credential): Observable<any> {
    let headers = new Headers();

    headers.append("Accept-Language", "en");
    headers.append("Content-Type", "application/json");

    return this._httpService.post(
      this._constants.LOGIN_SERVICE_URL,
      JSON.stringify({"userName": credential.user, "userPass": credential.pass}));
    // return this._http.post(this._constants.LOGIN_SERVICE_URL,
    //   JSON.stringify({"userName": credential.user, "userPass": credential.pass}), {
    //     headers: headers
    //   })
    // // .do(data => {console.log("All: login: "); console.log(data)})
    //   .catch(this.handleError);
  }

}