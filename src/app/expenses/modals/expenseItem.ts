import {Component} from "@angular/core";
import {ModalComponent} from '../../common/modal/modal.component';
import {ExpensePresenter} from '../expensePresenter';
import {FormGroup} from '@angular/forms';
import {IMyDpOptions} from 'mydatepicker';
import {PaymentMethod} from '../paymentMethod';
import {ExpensesDetailsPresenter} from '../expensesDetailsPresenter';

@Component({
  selector: 'expenseItem',
  moduleId: module.id,
  templateUrl: 'expenseItem.html',
  styleUrls: ['expenseItem.css'],
})
export class ExpenseItem {
  modal: ModalComponent;
  expensesDetails: ExpensesDetailsPresenter;
  expenseForm: FormGroup;
  paymentMethods: PaymentMethod[];
  isSaveButtonDisplayed = false;
  private myOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    width: '150px'
  };

  constructor(public _modal: ModalComponent) {
    this.modal = _modal;
    this.expensesDetails = JSON.parse(JSON.stringify(this.modal.data.get("expense")));
    this.paymentMethods = JSON.parse(JSON.stringify(this.modal.data.get("paymentMethods")));
    console.log("expenses details: ");
    console.log(this.expensesDetails);

    console.log("payment methods: ");
    console.log(this.paymentMethods);
  }

  onChangeSpendingInList(type: string, id: number) {
    let exp = this.expensesDetails.expenses.find(x => x.id === id);
    if (exp) {
      if (type === 'spent') {
        exp.spending = true;
      } else {
        exp.spending = false;
      }

      exp.updated = true;
    }

    this.isSaveButtonDisplayed = true;
  }

  onCancel() {
    this.isSaveButtonDisplayed = false;
    this.expensesDetails = JSON.parse(JSON.stringify(this.modal.data.get("expense")));
    this.paymentMethods = JSON.parse(JSON.stringify(this.modal.data.get("paymentMethods")));
  }

  close() {
    this.modal.close();
  }

  login(username: string, password: string) {
    // let data = {username: username, pasword: password}
    // this.modal.close(data);
  }
}
