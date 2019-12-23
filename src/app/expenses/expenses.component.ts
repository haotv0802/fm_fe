import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from '../common/modal/modal.component';
import {Expense} from './expense';
import {ExpensesService} from './expenses.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentMethod} from './paymentMethod';
import {Observable} from 'rxjs/Rx';
import {ExpensesDetailsPresenter} from './expensesDetailsPresenter';
import {IMyDateModel, INgxMyDpOptions} from 'ngx-mydatepicker';

@Component({
  moduleId: module.id,
  templateUrl: 'expenses.component.html'
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
  private myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };
  public model: Object = {date: {year: 2018, month: 10, day: 9}};

  constructor(
    private _expensesService: ExpensesService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.pageTitle = 'Expenses';
  }

  onDateChanged(event: IMyDateModel): void {
    // date selected
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
          paymentMethod_edit: ['', [Validators.required]],
          spending_edit: true
        });
        this.loaderOpen = false;
        console.log(this.expenseForm);
      },
      (error) => {
        console.log(error);
      }
    )
    ;
  }

  onSave() {
    console.log("SAVING");
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

  closeUpdateExpense(expense: Expense): void {
    expense.id = expense.id * -1;
    this.idUpdate = this.idUpdate * -1;
  }

  openUpdateExpense(expense: Expense): void {
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate !== expense.id) {
      let exp = this.expensesDetails.expenses.find(x => x.id === this.idUpdate);
      exp.id = exp.id * -1;
    }
    if (this.idUpdate && this.idUpdate === expense.id) {
      return;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;
    this.expenseForm.get('amount_edit').setValue(expense.amount);
    this.expenseForm.get('date_edit').setValue(expense.date);
    this.expenseForm.get('name_edit').setValue(expense.name);
    this.expenseForm.get('paymentMethod_edit').setValue(expense.cardId);
  }

  openOrCloseUpdateExpense(expense: Expense): void {
    // console.log(event);
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate !== expense.id) {
      let exp = this.expensesDetails.expenses.find(x => x.id === this.idUpdate);
      exp.id = exp.id * -1;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;
    this.expenseForm.get('amount_edit').setValue(expense.amount);
    this.expenseForm.get('date_edit').setValue(expense.date);
    this.expenseForm.get('name_edit').setValue(expense.name);
    this.expenseForm.get('paymentMethod_edit').setValue(expense.cardId);
  }

  updateExpense(expenseId: number): void {
    this.expenseEdit.amount = this.expenseForm.get('amount_edit').value;
    this.expenseEdit.date = this.expenseForm.get('date_edit').value.jsdate;
    if (this.expenseEdit.date === undefined) {
      this.expenseEdit.date = new Date();
    }
    this.expenseEdit.name = this.expenseForm.get('name_edit').value;
    this.expenseEdit.cardId = this.expenseForm.get('paymentMethod_edit').value;
    this.expenseEdit.id = expenseId > 0 ? expenseId : expenseId * -1;

    // console.log(this.expenseEdit);
    this._expensesService.updateExpense(this.expenseEdit).subscribe(
      (res) => {
        this._expensesService.getExpenses().subscribe(
          (expensesDetails) => {
            this.expensesDetails = expensesDetails;
            this.resetFormValues();
          }, (error: Error) => {
            console.log('-------------------updateExpense function: ');
            console.log(error);
          }
        );
      }, (error) => {
        console.log(error);
      }
    );
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
