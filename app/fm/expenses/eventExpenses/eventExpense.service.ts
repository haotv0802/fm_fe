import {Injectable} from "@angular/core";
import {HTTPService} from "../../../common/HTTP.service";
import {Constants} from "../../../common/constant";
import {Observable} from "rxjs/Observable";
import {Event} from "./event";
import {Expense} from "./expense";

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

  addExpense(expense: Expense, expenseId: number): Observable<any> {
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
    return this._httpService.post(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${expenseId}`, expense)
      .map((res) => { return res.json(); })
      ;
  }
}
