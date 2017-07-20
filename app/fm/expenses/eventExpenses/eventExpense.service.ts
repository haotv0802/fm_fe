import {Injectable} from "@angular/core";
import {HTTPService} from "../../../common/HTTP.service";
import {Constants} from "../../../common/constant";
import {Observable} from "rxjs/Observable";
import {Event} from "./event";

@Injectable()
export class EventExpenseService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  checkEventExpenses(expenseId: number): Observable<boolean> {
    return this._httpService.get(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${expenseId}/check`)
      .map((res) => {
        return <boolean>res.json().isEventExisting;
      })
      // .do((res) => {console.log(res)})
      ;
  }

  getEventExpenses(expenseId: number): Observable<Event> {
    return this._httpService.get(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${expenseId}`)
      .map((res) => {
        return <Event>res.json();
      })
      // .do((res) => {console.log(res)})
      ;
  }
}
