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
    return this._httpService.post(this._constants.EXPENSES_SERVICE_URL, expense)
      .map((res) => { return res.json(); })
      ;
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this._httpService.delete(this._constants.EXPENSES_SERVICE_URL + `/${expenseId}/delete`)
      .map((res) => { return res.json(); })
      ;
  }

  updateExpense(expense: Expense): Observable<any> {
    return this._httpService.patch(this._constants.EXPENSES_SERVICE_URL, expense)
      .map((res) => { return res.json(); })
      ;
  }

  getExpenses(): Observable<ExpensesDetailsPresenter> {
    return this._httpService.get(this._constants.EXPENSES_SERVICE_URL)
      .map((res) => { return <ExpensesDetailsPresenter> res.json(); })
      ;
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this._httpService.get(this._constants.PAYMENT_METHODS_SERVICE_URL)
      .map((res) => { return <PaymentMethod[]> res.json(); })
      ;
  }

  updateExpenseAmount(expenseId: number, amount: number): Observable<any> {
    return this._httpService.get(this._constants.EXPENSES_SERVICE_URL + `/${expenseId}/${amount}/updateAmount`)
      .map((res) => {
        return <Event>res.json();
      })
      // .do((res) => {console.log(res)})
      ;
  }
}
