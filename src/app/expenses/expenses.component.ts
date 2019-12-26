import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from '../common/modal/modal.component';
import {Expense} from './expense';
import {ExpensesService} from './expenses.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentMethod} from './paymentMethod';
import {Observable} from 'rxjs/Rx';
import {ExpensesDetailsPresenter} from './expensesDetailsPresenter';
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
  expensesDetails: ExpensesDetailsPresenter;
  loaderOpen: boolean = true;
  expenseForm: FormGroup;
  expenseEdit: Expense = new Expense();
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
    console.log(this.expensesDetails.expenses);
  }

  ngOnInit(): void {
    Observable.forkJoin(
      this._expensesService.getExpenses(),
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        this.expensesDetails = data[0];
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

  onSave() {
    // in case user is in update mode and click on SAVE button (without pressing ESC button)
    if (this.idUpdate && this.idUpdate < 0 && this.expenseForm.get('amount_edit').value) {
      let exp = this.expensesDetails.expenses.find(x => x.id === this.idUpdate);

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
    let items = this.expensesDetails.expenses.filter((item) => {
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
  }

  onChangeSpending(type: string) {
    if (type === 'spent') {
      this.expenseForm.get('spending').setValue(true);
    } else {
      this.expenseForm.get('spending').setValue(false);
    }
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
  }

  deleteExpense(expenseId: number): void {
    this._expensesService.deleteExpense(expenseId).subscribe(
      (res) => {
        this._expensesService.getExpenses().subscribe(
          (expensesDetails) => {
            this.expensesDetails = expensesDetails;
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
        console.log(this.paymentMethods);
      }
    );
  }

  getExpensesDetails(): void {
    this._expensesService.getExpenses().subscribe(
      (expensesDetails) => {
        this.expensesDetails = expensesDetails;
        console.log(this.expensesDetails);
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  addExpense(): void {
    this.expenseEdit.amount = this.expenseForm.get('amount').value;
    this.expenseEdit.date = this.expenseForm.get('date').value.jsdate;
    if (this.expenseEdit.date === undefined) {
      this.expenseEdit.date = new Date();
    }
    this.expenseEdit.name = this.expenseForm.get('name').value;
    // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
    this.expenseEdit.cardId = this.expenseForm.get('paymentMethod').value;
    console.log(this.expenseEdit);

    this._expensesService.addExpense(this.expenseEdit).subscribe(
      (res) => {
        this._expensesService.getExpenses().subscribe(
          (expensesDetails) => {
            this.expensesDetails = expensesDetails;
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
    console.log(this.expenseForm.value);
    // expense.amount = this.expenseForm.get('amount_edit').value;
    // expense.date = this.expenseForm.get('date_edit').value;
    // if (expense.date === undefined) {
    //   expense.date = new Date();
    // }
    // expense.name = this.expenseForm.get('name_edit').value;
    // expense.moneySourceId = this.expenseForm.get('paymentMethod_edit').value;
    // expense.id = expense.id > 0 ? expense.id : expense.id * -1;

  }

  closeUpdateExpense(expense: Expense): void {
    let exp = this.expensesDetails.expenses.find(x => x.id === expense.id);
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
      let exp = this.expensesDetails.expenses.find(x => x.id === this.idUpdate);

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
  }
}
