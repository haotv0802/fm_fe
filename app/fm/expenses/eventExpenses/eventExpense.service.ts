import {Injectable} from "@angular/core";
import {HTTPService} from "../../../common/HTTP.service";
import {Constants} from "../../../common/constant";
import {Observable} from "rxjs/Observable";
import {Event} from "./event";
import {Expense} from "../expense";
import {EventExpense} from "./eventExpense";

@Injectable()
export class EventExpenseService {
  expenseCreation: Expense;

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

  addExpense(expense: EventExpense, expenseId: number): Observable<any> {
    return this._httpService.post(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${expenseId}`, expense)
      .map((res) => { return res.json(); })
      ;
  }

  updateExpense(expense: EventExpense, expenseId: number): Observable<any> {
    console.log(expense);
    return this._httpService.patch(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${expenseId}/${expense.id}`, expense)
      .map((res) => { return res.json(); })
      ;
  }

  deleteExpense(expenseId: number, eventExpenseId: number): Observable<any> {
    return this._httpService.delete(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${expenseId}/${eventExpenseId}`)
      .map((res) => { return res.json(); })
      ;
  }
}
