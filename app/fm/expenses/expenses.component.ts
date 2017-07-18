import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {ModalComponent} from "../../common/modal/modal.component";
import {Expense} from "./expense";
import {ExpensesService} from "./expenses.service";
import {ExpensesDetails} from "./expensesDetails";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentMethod} from "./paymentMethod";

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
    private _usersService: ExpensesService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.pageTitle = 'Expenses';
  }

  ngOnInit(): void {
    this.getExpenses();
    this.getExpensesDetails();
    this.getPaymentMethods();

    this.expensesForm = this.fb.group({
      amount: ['', [Validators.required]],
      date: [''],
      place: [''],
      paymentMethod: ['', [Validators.required]],
      forPerson: ['']
    });
  }

  getExpenses(): void {
    this._usersService.getExpenses().subscribe(
      (expenses) => {
        this.expenses = expenses;
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  getPaymentMethods(): void {
    this._usersService.getPaymentMethods().subscribe(
      (paymentMethods) => {
        this.paymentMethods = paymentMethods;
        console.log(this.paymentMethods);
      }
    );
  }

  getExpensesDetails(): void {
    this._usersService.getExpensesDetails().subscribe(
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
    this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
    this.expenseEdit.forPerson = this.expensesForm.get("forPerson").value;
  }
}
