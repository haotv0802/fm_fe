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
          forPerson: [''],
          amount_edit: ['', [Validators.required]],
          date_edit: [''],
          place_edit: [''],
          paymentMethod_edit: ['', [Validators.required]],
          forPerson_edit: [''],
          anEvent_edit: ['']
        });
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
    ;
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

  openUpdateExpense(expense: Expense): void {
    console.log("last id: " + this.idUpdate);
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
      let exp = this.expensesDetails.expenses.find(x => x.id == this.idUpdate);
      exp.id = exp.id * -1;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;
    this.expenseAddForm.get("amount_edit").setValue(expense.amount);
    this.expenseAddForm.get("date_edit").setValue(expense.date);
    this.expenseAddForm.get("place_edit").setValue(expense.place);
    this.expenseAddForm.get("forPerson_edit").setValue(expense.forPerson);
    this.expenseAddForm.get("paymentMethod_edit").setValue(expense.cardId);
    this.expenseAddForm.get("anEvent_edit").setValue(expense.anEvent);
    console.log("latest id: " + this.idUpdate);
  }

  updateExpense(expenseId: number): void {
    this.expenseEdit.amount = this.expenseAddForm.get("amount_edit").value;
    this.expenseEdit.date = this.expenseAddForm.get("date_edit").value;
    this.expenseEdit.place = this.expenseAddForm.get("place_edit").value;
    this.expenseEdit.forPerson = this.expenseAddForm.get("forPerson_edit").value;
    this.expenseEdit.cardId = this.expenseAddForm.get("paymentMethod_edit").value;
    this.expenseEdit.anEvent = this.expenseAddForm.get("anEvent_edit").value;
    this.expenseEdit.id = expenseId > 0 ? expenseId : expenseId * -1;

    console.log(this.expenseEdit);

    this._expensesService.updateExpense(this.expenseEdit).subscribe(
      (res) => {
        this._expensesService.getExpenses().subscribe(
          (expensesDetails) => {
            this.expensesDetails = expensesDetails;
            this.resetFormValues();
          }, (error: Error) => {
            console.log("-------------------updateExpense function: ");
            console.log(error);
          }
        );
      }, (error) => {
        console.log(error);
      }
    );
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
      forPerson: '',
      amount_edit: '',
      date_edit: '',
      place_edit: '',
      paymentMethod_edit: '',
      forPerson_edit: '',
      anEvent_edit: ''
    });
    this.idUpdate = undefined;
  }
}
