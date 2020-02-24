import {Component} from "@angular/core";
import {ModalComponent} from '../../common/modal/modal.component';
import {ExpensePresenter} from '../expensePresenter';
import {FormGroup} from '@angular/forms';
import {IMyDpOptions} from 'mydatepicker';
import {PaymentMethod} from '../paymentMethod';
import {ExpensesDetailsPresenter} from '../expensesDetailsPresenter';
import {ExpensesService} from '../expenses.service';

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
  // dateModel: any[];
  isSaveButtonDisplayed = false;
  private myOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    width: '150px'
  };


  constructor(public _modal: ModalComponent,
              private _expensesService: ExpensesService
  ) {
    this.modal = _modal;
    this.expensesDetails = JSON.parse(JSON.stringify(this.modal.data.get("expense")));
    this.paymentMethods = JSON.parse(JSON.stringify(this.modal.data.get("paymentMethods")));

    // this.dateModel = [];
    for (let i = 0; i < this.expensesDetails.expenses.length; i++) {
      // this.dateModel.push(this.expensesDetails.expenses[i].date);
      let expenseDate = new Date(this.expensesDetails.expenses[i].date);

      this.expensesDetails.expenses[i].dateModal = {
        date: {
          year: expenseDate.getFullYear(),
          month: (expenseDate.getMonth() + 1),
          day: expenseDate.getDate()
        }
      };
    }

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

  updateExpense(expense: ExpensePresenter): void {
    expense.updated = true;
    this.isSaveButtonDisplayed = true;
  }

  onSave() {
    // update id of item in case it is minus (for update mode)
    let items = this.expensesDetails.expenses.filter((item) => {
      if (item.updated) {
        return item;
      }
    });
    console.log("items: ");
    console.log(items);

    this._expensesService.updateItems(items).subscribe(
      (res) => {
        this.modal.data.set("expense", this.expensesDetails);
        this.modal.close(this.expensesDetails);
      }, (error) => {
        console.log(error);
      }
    );
  }

  onCancel() {
    this.isSaveButtonDisplayed = false;
    this.expensesDetails = JSON.parse(JSON.stringify(this.modal.data.get("expense")));
    this.paymentMethods = JSON.parse(JSON.stringify(this.modal.data.get("paymentMethods")));
  }

  close() {
    this.modal.close();
  }
}
