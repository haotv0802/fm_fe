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
import {IMyDateModel, INgxMyDpOptions} from "ngx-mydatepicker";

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
  // editHidden: boolean = false;
  expenseEdit: Expense = new Expense();
  @ViewChild(ModalComponent) modal: ModalComponent;
  idUpdate: number;
  private myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };
  public model: Object = { date: { year: 2018, month: 10, day: 9 } };

  constructor(
    private _expensesService: ExpensesService,
    private _eventExpenseService: EventExpenseService,
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
        this.expenseForm = this.fb.group({
          amount: ['', [Validators.required]],
          date: [new Date()],
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
    this.expenseEdit.amount = this.expenseForm.get("amount").value;
    this.expenseEdit.date = this.expenseForm.get("date").value.jsdate;
    if (this.expenseEdit.date == undefined) {
      this.expenseEdit.date = new Date();
    }
    this.expenseEdit.place = this.expenseForm.get("place").value;
    // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
    this.expenseEdit.forPerson = this.expenseForm.get("forPerson").value;
    this.expenseEdit.cardId = this.expenseForm.get("paymentMethod").value;
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
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
      let exp = this.expensesDetails.expenses.find(x => x.id == this.idUpdate);
      exp.id = exp.id * -1;
    }
    if (this.idUpdate && this.idUpdate == expense.id) {
      return;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;
    this.expenseForm.get("amount_edit").setValue(expense.amount);
    this.expenseForm.get("date_edit").setValue(expense.date);
    this.expenseForm.get("place_edit").setValue(expense.place);
    this.expenseForm.get("forPerson_edit").setValue(expense.forPerson);
    this.expenseForm.get("paymentMethod_edit").setValue(expense.cardId);
    this.expenseForm.get("anEvent_edit").setValue(expense.anEvent);
  }

  openOrCloseUpdateExpense(expense: Expense): void {
    // console.log(event);
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
      let exp = this.expensesDetails.expenses.find(x => x.id == this.idUpdate);
      exp.id = exp.id * -1;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;
    this.expenseForm.get("amount_edit").setValue(expense.amount);
    this.expenseForm.get("date_edit").setValue(expense.date);
    this.expenseForm.get("place_edit").setValue(expense.place);
    this.expenseForm.get("forPerson_edit").setValue(expense.forPerson);
    this.expenseForm.get("paymentMethod_edit").setValue(expense.cardId);
    this.expenseForm.get("anEvent_edit").setValue(expense.anEvent);
  }

  updateExpense(expenseId: number): void {
    this.expenseEdit.amount = this.expenseForm.get("amount_edit").value;
    this.expenseEdit.date = this.expenseForm.get("date_edit").value.jsdate;
    if (this.expenseEdit.date == undefined) {
      this.expenseEdit.date = new Date();
    }
    this.expenseEdit.place = this.expenseForm.get("place_edit").value;
    this.expenseEdit.forPerson = this.expenseForm.get("forPerson_edit").value;
    this.expenseEdit.cardId = this.expenseForm.get("paymentMethod_edit").value;
    this.expenseEdit.anEvent = this.expenseForm.get("anEvent_edit").value;
    this.expenseEdit.id = expenseId > 0 ? expenseId : expenseId * -1;

    // console.log(this.expenseEdit);
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
    this.expenseEdit.amount = this.expenseForm.get("amount").value;
    this.expenseEdit.date = this.expenseForm.get("date").value;
    this.expenseEdit.place = this.expenseForm.get("place").value;
    this.expenseEdit.forPerson = this.expenseForm.get("forPerson").value;
    this.expenseEdit.cardId = this.expenseForm.get("paymentMethod").value;
    this.expenseEdit.anEvent = true;
    this._eventExpenseService.expenseCreation = this.expenseEdit;
    this._router.navigate(["expenses/-1"]);
  }

  openEvent(id: number): void {
    this._router.navigate([`expenses/${id}`]);
  }


  resetFormValues(): void {
    this.expenseForm.setValue({
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
