import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from '../common/modal/modal.component';
import {Expense} from './expense';
import {ExpensesService} from './expenses.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentMethod} from './paymentMethod';
import {Observable} from 'rxjs/Rx';
import {ExpensePresenter} from './expensePresenter';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
import {createIMyDateModel} from '../utils';

@Component({
  moduleId: module.id,
  templateUrl: 'expenses.component.html',
  styleUrls: ['expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  pageTitle: string;
  paymentMethods: PaymentMethod[];
  expensesDetails: ExpensePresenter[];
  expensesTotal: number;
  loaderOpen: boolean = true;
  isSaveButtonDisplayed: boolean = false;
  expenseForm: FormGroup;
  expenseAdd: Expense = new Expense();
  @ViewChild(ModalComponent) modal: ModalComponent;
  idUpdate: number;
  private myOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    width: '150px'
  };

  constructor(
    private _expensesService: ExpensesService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.pageTitle = 'Expenses';
  }

  onDateChanged(event: IMyDateModel): void {
    console.log(event);
    console.log(this.expenseForm.value);
    console.log(this.expensesDetails);
  }

  calculateExpensesTotal(expensesList: ExpensePresenter[]): void {
    this.expensesTotal = 0;
    for (let i = 0; i < expensesList.length; i++) {
      let expense: ExpensePresenter = expensesList[i];
      if (expense.spending) {
        this.expensesTotal -= expense.amount;
      } else {
        this.expensesTotal += expense.amount;
      }
    }
  }

  ngOnInit(): void {
    Observable.forkJoin(
      this._expensesService.getExpenses(),
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        this.expensesDetails = data[0];
        this.calculateExpensesTotal(this.expensesDetails);

        this.paymentMethods = data[1];
        console.log(this.expensesDetails);
        console.log(this.paymentMethods);

        this.expenseForm = this.fb.group({
          amount: ['', [Validators.required]],
          date: [new Date()],
          name: [''],
          paymentMethod: ['', [Validators.required]],
          spending: true,
          amount_edit: ['', [Validators.required]],
          date_edit: [''],
          name_edit: [''],
          paymentMethod_edit: ['1', [Validators.required]],
          spending_edit: true
        });
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
    ;
  }

  onCancel() {
    this._expensesService.getExpenses().subscribe(
      (expensesDetails) => {
        this.expensesDetails = expensesDetails;
        this.calculateExpensesTotal(this.expensesDetails);
        this.resetFormValues();
      }, (error: Error) => {
        console.log('-------------------Cancel function: ');
        console.log(error);
      }
    );
  }

  onSave() {
    // in case user is in update mode and click on SAVE button (without pressing ESC button)
    if (this.idUpdate && this.idUpdate < 0 && this.expenseForm.get('amount_edit').value) {
      let exp = this.expensesDetails.find(x => x.id === this.idUpdate);

      if (this.expenseForm.get('amount_edit').value) {
        exp.amount = this.expenseForm.get('amount_edit').value;
        exp.date = this.expenseForm.get('date_edit').value.jsdate.getTime();
        if (exp.date === undefined) {
          exp.date = new Date();
        }
        exp.name = this.expenseForm.get('name_edit').value;
        exp.moneySourceId = this.expenseForm.get('paymentMethod_edit').value;
      }
      exp.id = exp.id * -1;
    }

    // update id of item in case it is minus (for update mode)
    let items = this.expensesDetails.filter((item) => {
      if (item.updated) {
        item.id = item.id > 0 ? item.id : item.id * -1;
        return item;
      }
    });

    this._expensesService.updateItems(items).subscribe(
      (res) => {
        this._expensesService.getExpenses().subscribe(
          (expensesDetails) => {
            this.expensesDetails = expensesDetails;
            this.calculateExpensesTotal(this.expensesDetails);
            this.resetFormValues();
          }, (error: Error) => {
            console.log('-------------------Saving function: ');
            console.log(error);
          }
        );
      }, (error) => {
        console.log(error);
      }
    );

    // in case user is adding and editing at the same time.
    if (this.expenseForm.get('amount').value) {
      this.addExpense();
    }
  }

  onChangeSpending(type: string) {
    if (type === 'spent') {
      this.expenseForm.get('spending').setValue(true);
    } else {
      this.expenseForm.get('spending').setValue(false);
    }
  }

  onChangeSpendingInList(type: string, id: number) {
    let exp = this.expensesDetails.find(x => x.id === id);
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

  deleteExpense(expenseId: number): void {
    this._expensesService.deleteExpense(expenseId).subscribe(
      (res) => {
        this._expensesService.getExpenses().subscribe(
          (expensesDetails) => {
            this.expensesDetails = expensesDetails;
            this.calculateExpensesTotal(this.expensesDetails);
            this.resetFormValues();
          }, (error: Error) => {
            console.log(error);
          }
        );
      }, (error) => {
        console.log(error);
      }
    );
  }

  getPaymentMethods(): void {
    this._expensesService.getPaymentMethods().subscribe(
      (paymentMethods) => {
        this.paymentMethods = paymentMethods;
      }
    );
  }

  getExpensesDetails(): void {
    this._expensesService.getExpenses().subscribe(
      (expensesDetails) => {
        this.expensesDetails = expensesDetails;
        this.calculateExpensesTotal(this.expensesDetails);
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
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
        this._expensesService.getExpenses().subscribe(
          (expensesDetails) => {
            this.expensesDetails = expensesDetails;
            this.calculateExpensesTotal(this.expensesDetails);
            this.resetFormValues();
          }, (error: Error) => {
            console.log(error);
          }
        );
      }, (error: Error) => {
        console.log(error);
      }
    );
  }

  updateExpense(expense: ExpensePresenter): void {
    expense.updated = true;
    this.isSaveButtonDisplayed = true;
  }

  closeUpdateExpense(expense: Expense): void {
    let exp = this.expensesDetails.find(x => x.id === expense.id);
    exp.amount = this.expenseForm.get('amount_edit').value;
    exp.date = this.expenseForm.get('date_edit').value.jsdate.getTime();
    if (exp.date === undefined) {
      exp.date = new Date();
    }
    exp.name = this.expenseForm.get('name_edit').value;
    exp.moneySourceId = this.expenseForm.get('paymentMethod_edit').value;
    exp.id = expense.id > 0 ? expense.id : expense.id * -1;

    this.resetFormValues();
  }

  openUpdateExpense(expense: Expense): void {
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate !== expense.id) {
      let exp = this.expensesDetails.find(x => x.id === this.idUpdate);

      if (this.expenseForm.get('amount_edit').value) {
        exp.amount = this.expenseForm.get('amount_edit').value;
        exp.date = this.expenseForm.get('date_edit').value.jsdate.getTime();
        if (exp.date === undefined) {
          exp.date = new Date();
        }
        exp.name = this.expenseForm.get('name_edit').value;
        exp.moneySourceId = this.expenseForm.get('paymentMethod_edit').value;
      }
      exp.id = exp.id * -1;
    }
    if (this.idUpdate && this.idUpdate === expense.id) {
      return;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;

    this.expenseForm.get('amount_edit').setValue(expense.amount);

    let dateTemp = new Date(expense.date);
    this.expenseForm.get('date_edit').setValue(createIMyDateModel(dateTemp));
    this.expenseForm.get('name_edit').setValue(expense.name);
    this.expenseForm.get('paymentMethod_edit').setValue(expense.cardId);
  }

  resetFormValues(): void {
    this.expenseForm.setValue({
      amount: '',
      date: '',
      name: '',
      paymentMethod: '',
      spending: true,
      amount_edit: '',
      date_edit: '',
      name_edit: '',
      paymentMethod_edit: '',
      spending_edit: true
    });
    this.idUpdate = undefined;
    this.isSaveButtonDisplayed = false;
  }
}
