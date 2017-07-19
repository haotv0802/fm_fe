import {Injectable} from "@angular/core";
import {HTTPService} from "../../../common/HTTP.service";
import {Constants} from "../../../common/constant";
import {Observable} from "rxjs/Observable";

@Injectable()
export class EventExpenseService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  checkEventExpenses(expenseId: number): Observable<any> {
    return this._httpService.get(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${expenseId}/check`)
      .map((res) => {
        return res.json();
      })
      // .do((res) => {console.log(res)})
      ;
  }
}
