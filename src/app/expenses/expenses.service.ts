import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Constants} from "../common/constant";
import {HTTPService} from "../common/HTTP.service";
import {Expense} from "./expense";
import {ExpensesDetailsPresenter} from "./expensesDetailsPresenter";
import 'rxjs/add/operator/catch';
import {PaymentMethod} from './paymentMethod';
import {ExpensePresenter} from './expensePresenter';
import {HttpParams} from '@angular/common/http';
import {RequestOptions, URLSearchParams} from '@angular/http';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class ExpensesService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants
  ) {

  }

  addExpense(expense: Expense): Observable<any> {
    return this._httpService.post(this._constants.EXPENSES_SERVICE_URL, expense)
      .map((res) => { return res.json(); })
      .catch(err => Observable.throw(err))
      ;
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this._httpService.delete(this._constants.EXPENSES_SERVICE_URL + `/${expenseId}/delete`)
      .map((res) => { return res.json(); })
      ;
  }

  updateItems(items: ExpensePresenter[]): Observable<any> {
    return this._httpService.patch(this._constants.EXPENSES_SERVICE_UPDATE_LIST_URL, items)
      .map((res) => { return res.json(); })
      ;
  }

  getExpenses(name: string): Observable<ExpensesDetailsPresenter> {
    let params: URLSearchParams = new URLSearchParams();
    params.set("name", name);
    return this._httpService.get(this._constants.EXPENSES_SERVICE_URL, params)
      .map((res) => { return <ExpensesDetailsPresenter> res.json(); })
      ;
  }

  getExpenseByYearAndMonth(year: number, month: number, name: string): Observable<ExpensesDetailsPresenter> {
    return this._httpService.get(this._constants.EXPENSES_SERVICE_URL + `/${year}` + `/${month}`)
      .map((res) => { return <ExpensesDetailsPresenter> res.json(); })
      ;
  }

  getExpensesByYear(year: number, name: string): Observable<ExpensesDetailsPresenter[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set("name", name);

    return this._httpService.get(this._constants.EXPENSES_SERVICE_URL + `/${year}`, params)
      .map((res) => { return <ExpensesDetailsPresenter[]> res.json(); })
      ;
  }

  getLastMonths(name: string): Observable<ExpensesDetailsPresenter[]> {
    return this._httpService.get(this._constants.EXPENSES_SERVICE_LAST_MONTH_URL)
      .map((res) => { return <ExpensesDetailsPresenter[]> res.json(); })
      ;
  }

  getYearList(): Observable<number[]> {
    return this._httpService.get(this._constants.EXPENSES_SERVICE_YEAR_LIST_URL)
      .map((res) => { return <number[]> res.json(); })
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

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this._httpService.get(this._constants.PAYMENT_METHODS_LIST)
      .map((res) => { return <PaymentMethod[]> res.json(); })
      ;
  }
}
