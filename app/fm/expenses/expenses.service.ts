///<reference path="../../common/constant.ts"/>
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Constants} from "../../common/constant";
import {HTTPService} from "../../common/HTTP.service";
import {PaymentMethod} from "./paymentMethod";
import {Expense} from "./expense";
import {ExpensesDetailsPresenter} from "./expensesDetailsPresenter";

@Injectable()
export class ExpensesService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {

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

  getExpenses(): Observable<ExpensesDetailsPresenter> {
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
      .map((res) => { return <ExpensesDetailsPresenter> res.json(); })
      ;
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this._httpService.get(this._constants.PAYMENT_METHODS_SERVICE_URL)
      .map((res) => { return <PaymentMethod[]> res.json(); })
      ;
  }
}
