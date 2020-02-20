import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Constants} from "../common/constant";
import {HTTPService} from "../common/HTTP.service";
import {Expense} from "./expense";
import 'rxjs/add/operator/catch';
import {PaymentMethod} from './paymentMethod';
import {ExpensePresenter} from './expensePresenter';

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

  updateItems(items: ExpensePresenter[]): Observable<any> {
    return this._httpService.patch(this._constants.EXPENSES_SERVICE_UPDATE_LIST_URL, items)
      .map((res) => { return res.json(); })
      ;
  }

  getExpenses(): Observable<ExpensePresenter[]> {
    return this._httpService.get(this._constants.EXPENSES_SERVICE_URL)
      .map((res) => { return <ExpensePresenter[]> res.json(); })
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
    return this._httpService.get(this._constants.PAYMENT_METHODS_SERVICE_URL)
      .map((res) => { return <PaymentMethod[]> res.json(); })
      ;
  }
}
