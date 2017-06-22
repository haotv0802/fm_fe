import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {ModalComponent} from "../../common/modal/modal.component";
import {Expense} from "./expense";
import {ExpensesService} from "./expenses.service";

@Component({
  moduleId: module.id,
  templateUrl: 'expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  pageTitle: string;
  expenses: Expense[];
  loaderOpen: boolean = true;
  @ViewChild(ModalComponent) modal: ModalComponent;

  constructor(
    private _usersService: ExpensesService,
    private _router: Router
  ) {
    this.pageTitle = 'Expenses';
  }

  ngOnInit(): void {
    this.getExpenses();
  }

  getExpenses(): void {
    this._usersService.getUsers().subscribe(
      (expenses) => {
        this.expenses = expenses;
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
