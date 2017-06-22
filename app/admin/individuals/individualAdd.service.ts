import {Injectable} from "@angular/core";
import {Constants} from "../../common/constant";
import {HTTPService} from "../../common/HTTP.service";
import {Individual} from "./individual";
import {Observable} from "rxjs";

@Injectable()
export class IndividualAddService {

  public individual: Individual;

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  isUserNameExisting(userName: string): Observable<any> {
    return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_USERNAME_CHECK_SERVICE_URL + "/" + userName)
      .map((res) => res.json())
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      ;
  }
}
