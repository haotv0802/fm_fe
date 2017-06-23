import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {ModalComponent} from "../../common/modal/modal.component";
import {Expense} from "./expense";
import {ExpensesService} from "./expenses.service";
import {ExpensesDetails} from "./expensesDetails";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  moduleId: module.id,
  templateUrl: 'expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  pageTitle: string;
  expenses: Expense[];
  expensesDetails: ExpensesDetails;
  loaderOpen: boolean = true;
  expensesForm: FormGroup;
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
    this.expensesForm = this.fb.group({
      amount: ['', [Validators.required]],
      date: [''],
      place: ['', [Validators.required]],
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

  getExpensesDetails(): void {
    this._usersService.getExpensesDetails().subscribe(
      (expensesDetails) => {
        this.expensesDetails = expensesDetails;
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
}
