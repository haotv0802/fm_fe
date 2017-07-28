import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {ModalComponent} from "../../common/modal/modal.component";
import {Expense} from "./expense";
import {ExpensesService} from "./expenses.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentMethod} from "./paymentMethod";
import {Observable} from "rxjs/Rx";
import {ExpensesDetailsPresenter} from "./expensesDetailsPresenter";
import {EventExpenseService} from "./eventExpenses/eventExpense.service";

@Component({
  moduleId: module.id,
  templateUrl: 'expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  pageTitle: string;
  paymentMethods: PaymentMethod[];
  expensesDetails: ExpensesDetailsPresenter;
  loaderOpen: boolean = true;
  expenseAddForm: FormGroup;
  // editHidden: boolean = false;
  expenseEdit: Expense = new Expense();
  @ViewChild(ModalComponent) modal: ModalComponent;
  idUpdate: number;

  constructor(
    private _expensesService: ExpensesService,
    private _eventExpenseService: EventExpenseService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.pageTitle = 'Expenses';
  }

  ngOnInit(): void {
    Observable.forkJoin(
      this._expensesService.getExpenses(),
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        this.expensesDetails = data[0];
        this.paymentMethods = data[1];
        console.log(this.paymentMethods);
        console.log(this.expensesDetails);
        this.expenseAddForm = this.fb.group({
          amount: ['', [Validators.required]],
          date: [''],
          place: [''],
          paymentMethod: ['', [Validators.required]],
          forPerson: ['']
        });
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
    ;
  }

  updateExpense(expense: Expense): void {
    if (this.idUpdate != expense.id && this.idUpdate) {
      let exp = this.expensesDetails.expenses.find(x => x.id == this.idUpdate);
      exp.id = exp.id * -1;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;
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
    this.expenseEdit.amount = this.expenseAddForm.get("amount").value;
    this.expenseEdit.date = this.expenseAddForm.get("date").value;
    this.expenseEdit.place = this.expenseAddForm.get("place").value;
    // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
    this.expenseEdit.forPerson = this.expenseAddForm.get("forPerson").value;
    this.expenseEdit.cardId = this.expenseAddForm.get("paymentMethod").value;
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

  editExpense(): void {

  }

  addEvent(): void {
    this.expenseEdit.amount = this.expenseAddForm.get("amount").value;
    this.expenseEdit.date = this.expenseAddForm.get("date").value;
    this.expenseEdit.place = this.expenseAddForm.get("place").value;
    this.expenseEdit.forPerson = this.expenseAddForm.get("forPerson").value;
    this.expenseEdit.cardId = this.expenseAddForm.get("paymentMethod").value;
    this.expenseEdit.anEvent = true;
    this._eventExpenseService.expenseCreation = this.expenseEdit;
    this._router.navigate(["expenses/-1"]);
  }

  openEvent(id: number): void {
    this._router.navigate([`expenses/${id}`]);
  }


  resetFormValues(): void {
    this.expenseAddForm.setValue({
      amount: '',
      date: '',
      place: '',
      paymentMethod: '',
      forPerson: ''
    });
  }
}
