import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {ModalComponent} from "../../common/modal/modal.component";
import {Expense} from "./expense";
import {ExpensesService} from "./expenses.service";
import {ExpensesDetails} from "./expensesDetails";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentMethod} from "./paymentMethod";
import {Observable} from "rxjs/Rx";

@Component({
  moduleId: module.id,
  templateUrl: 'expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  pageTitle: string;
  expenses: Expense[];
  paymentMethods: PaymentMethod[];
  expensesDetails: ExpensesDetails;
  loaderOpen: boolean = true;
  expensesForm: FormGroup;
  // editHidden: boolean = false;
  expenseEdit: Expense = new Expense();
  @ViewChild(ModalComponent) modal: ModalComponent;

  constructor(
    private _expensesService: ExpensesService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.pageTitle = 'Expenses';
  }

  ngOnInit(): void {
    Observable.forkJoin(
      this._expensesService.getExpensesDetails(),
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        this.expensesDetails = data[0];
        this.paymentMethods = data[1];
        this.expensesForm = this.fb.group({
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

  loadExpenses(): void {
    Observable.forkJoin(
      this._expensesService.getExpensesDetails(),
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        this.expensesDetails = data[0];
        this.paymentMethods = data[1];
      },
      (error) => {
        console.log(error);
      }
    )
    ;
    // this.getExpenses();
    // this.getExpensesDetails();
    // this.getPaymentMethods();
  }

  getExpenses(): void {
    this._expensesService.getExpenses().subscribe(
      (expenses) => {
        this.expenses = expenses;
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  addExpense(expense: Expense): void {
    this._expensesService.addExpense(expense).subscribe(
      (res) => {
        console.log(res);
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
    this._expensesService.getExpensesDetails().subscribe(
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

  editUser(): void {
    // this._router.navigate(["admin/usersUpdate"]);
    // this.popupUsersUpdate();
  }

  // popupUsersUpdate(): void {
  //   this.modal.modalTitle = "User Update";
  //   this.modal.modalFooter = false;
  //   this.modal.modalMessage = true;
  //   this.modal.documentWidth = 800;
  //   // this.modal.message = "Here Users Update component will load.";
  //   this.modal.open(UsersUpdateComponent);
  // }

  editExpense(): void {
    this.expenseEdit.amount = this.expensesForm.get("amount").value;
    this.expenseEdit.date = this.expensesForm.get("date").value;
    this.expenseEdit.place = this.expensesForm.get("place").value;
    // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
    this.expenseEdit.forPerson = this.expensesForm.get("forPerson").value;
    this.expenseEdit.cardId = this.expensesForm.get("paymentMethod").value;
    console.log(this.expenseEdit);
    // this.addExpense(this.expenseEdit);
    // this.loadExpenses();
    this.loaderOpen = true;
    Observable.forkJoin(
      this._expensesService.addExpense(this.expenseEdit),
      this._expensesService.getExpensesDetails(),
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        console.log(data[0]);
        this.expensesDetails = data[1];
        this.paymentMethods = data[2];
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
    ;
  }
}
