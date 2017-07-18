///<reference path="../../common/constant.ts"/>
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Constants} from "../../common/constant";
import {HTTPService} from "../../common/HTTP.service";
import {ExpensePresenter} from "./expensePresenter";
import {ExpensesDetails} from "./expensesDetails";
import {PaymentMethod} from "./paymentMethod";
import {Expense} from "./expense";

@Injectable()
export class ExpensesService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {

  }

  getExpenses(): Observable<ExpensePresenter[]> {
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
    return this._httpService.get(this._constants.EXPENSES_SERVICE_URL)
      .map((res) => { return <ExpensePresenter[]> res.json(); })
      ;
  }

  addExpense(expense: Expense): Observable<any> {
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
    return this._httpService.post(this._constants.EXPENSES_SERVICE_URL, expense)
      .map((res) => { return res.json(); })
      ;
  }

  getExpensesDetails(): Observable<ExpensesDetails> {
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
    return this._httpService.get(this._constants.EXPENSES_DETAILS_SERVICE_URL)
      .map((res) => { return <ExpensesDetails> res.json(); })
      ;
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this._httpService.get(this._constants.PAYMENT_METHODS_SERVICE_URL)
      .map((res) => { return <PaymentMethod[]> res.json(); })
      ;
  }
}
