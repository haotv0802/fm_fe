import {Component} from "@angular/core";
import {ModalComponent} from '../../common/modal/modal.component';
import {ExpensePresenter} from '../expensePresenter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import {PaymentMethod} from '../paymentMethod';
import {ExpensesDetailsPresenter} from '../expensesDetailsPresenter';
import {ExpensesService} from '../expenses.service';
import {createIMyDateModel} from '../../utils';
import {Expense} from '../expense';

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
  dateModel: any;
  isSaveButtonDisplayed = false;
  expenseAdd: Expense = new Expense();

  private myOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    width: '150px'
  };

  constructor(public _modal: ModalComponent,
              private _expensesService: ExpensesService,
              private fb: FormBuilder
  ) {
    this.modal = _modal;
  }

  ngOnInit(): void {
    this.expensesDetails = JSON.parse(JSON.stringify(this.modal.data.get("expense")));
    this.paymentMethods = JSON.parse(JSON.stringify(this.modal.data.get("paymentMethods")));

    for (let i = 0; i < this.expensesDetails.expenses.length; i++) {
      let expenseDate = new Date(this.expensesDetails.expenses[i].date);

      this.expensesDetails.expenses[i].dateModel = {
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

    let dateTemp;
    if (this.expensesDetails && this.expensesDetails.expenses && this.expensesDetails.expenses.length) {
      dateTemp = new Date(this.expensesDetails.expenses[0].date);
    }

    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required]],
      date: [{}],
      name: [''],
      paymentMethod: ['', [Validators.required]],
      spending: true
    });

    this.expenseForm.get('date').setValue(createIMyDateModel(dateTemp));

    console.log(this.expenseForm.value);
  }

  onDisplaySaveButton() {
    this.isSaveButtonDisplayed = true;
  }

  addExpense(): void {

    this.expenseAdd.amount = this.expenseForm.get('amount').value;
    this.expenseAdd.date = this.expenseForm.get('date').value.jsdate;
    if (this.expenseAdd.date === undefined) {
      this.expenseAdd.date = new Date();
    }
    this.expenseAdd.name = this.expenseForm.get('name').value;
    this.expenseAdd.spending = this.expenseForm.get('spending').value;
    this.expenseAdd.moneySourceId = this.expenseForm.get('paymentMethod').value;

    this._expensesService.addExpense(this.expenseAdd).subscribe(
      (res) => {
        this.resetFormValues();
      }, (error: Error) => {
        console.log(error);
      }
    );
  }

  onDateChanged(event: IMyDateModel, expense: ExpensePresenter): void {
    this.expensesDetails.expenses.find((item) => item.id === expense.id).date = event.jsdate;
    expense.updated = true;
    this.isSaveButtonDisplayed = true;
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

  resetFormValues(): void {
    this.expenseForm.setValue({
      amount_edit: '',
      date_edit: '',
      name_edit: '',
      paymentMethod_edit: '',
      spending_edit: true
    });
    this.isSaveButtonDisplayed = false;
  }
}
