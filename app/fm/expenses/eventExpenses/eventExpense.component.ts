import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {Subscription} from "rxjs/Subscription";
import {PaymentMethod} from "../paymentMethod";
import {ModalComponent} from "../../../common/modal/modal.component";
import {ExpensesService} from "../expenses.service";
import {EventExpenseService} from "./eventExpense.service";
import {Event} from "./event";
import {EventExpense} from "./eventExpense";

@Component({
  moduleId: module.id,
  templateUrl: 'eventExpense.component.html'
})
export class EventExpenseComponent implements OnInit, OnDestroy {
  pageTitle: string;
  private sub: Subscription;
  paymentMethods: PaymentMethod[];
  loaderOpen: boolean = true;
  expenseForm: FormGroup;
  expenseEdit: EventExpense = new EventExpense();
  expenseId: number;
  @ViewChild(ModalComponent) modal: ModalComponent;
  event: Event;
  idUpdate: number;

  constructor(
    private _expenseEventService: EventExpenseService,
    private _expensesService: ExpensesService,
    private _router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute
  ) {
    this.pageTitle = 'Expense Event';
  }

  ngOnInit(): void {
    this.sub = this._route.params.subscribe(
      params => {
        this.expenseId = +params['expenseId'];
        if (this.expenseId > 0) {
          this._expenseEventService.getEventExpenses(this.expenseId).subscribe(
            (event) => {
              this.event = event;
            }, (error) => {
              console.log(error);
            }
          );
        }
      });
    Observable.forkJoin(
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        this.paymentMethods = data[0];
        this.expenseForm = this.fb.group({
          amount: ['', [Validators.required]],
          date: [''],
          place: [''],
          paymentMethod: ['', [Validators.required]],
          forPerson: [''],
          amount_edit: ['', [Validators.required]],
          date_edit: [''],
          place_edit: [''],
          paymentMethod_edit: ['', [Validators.required]],
          forPerson_edit: ['']
        });
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
    ;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updateTotalAmount(expenseId: number, amount: number): void {
    let totalAmount: number = 0;
    for (let i = 0; i < this.event.expenses.length; i++) {
      if (this.event.expenses[i].id == expenseId) {
        totalAmount += amount;
      } else {
        totalAmount += this.event.expenses[i].amount;
      }
    }
    this._expensesService.updateExpenseAmount(this.event.id, totalAmount).subscribe(
      (res) => {

      }, (error: Error) => {
        console.log(error);
      }
    );
  }

  addAmount(amount: number): void {
    let totalAmount: number = this.event.total + amount;
    this._expensesService.updateExpenseAmount(this.event.id, totalAmount).subscribe(
      (res) => {

      }, (error: Error) => {
        console.log(error);
      }
    );
  }

  addExpense(): void {
    this.expenseEdit.amount = this.expenseForm.get("amount").value;
    this.expenseEdit.date = this.expenseForm.get("date").value;
    this.expenseEdit.place = this.expenseForm.get("place").value;
    // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
    this.expenseEdit.forPerson = this.expenseForm.get("forPerson").value;
    this.expenseEdit.cardId = this.expenseForm.get("paymentMethod").value;

    if (this.expenseId == -1) {
      this._expensesService.addExpense(this._expenseEventService.expenseCreation).subscribe(
        (res) => {
          this.expenseId = res.expenseId;
          this._addExpense();
        }
      );
    } else {
      this._addExpense();
    }
  }

  private _addExpense(): void {
    this._expenseEventService.addExpense(this.expenseEdit, this.expenseId).subscribe(
      (res) => {
        this._expenseEventService.getEventExpenses(this.expenseId).subscribe(
          (event) => {
            this.event = event;
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

  deleteExpense(expenseId: number, eventExpenseId: number): void {
    this._expenseEventService.deleteExpense(expenseId, eventExpenseId).subscribe(
      (res) => {
        this._expenseEventService.getEventExpenses(this.expenseId).subscribe(
          (res) => {
            this.event = res;
          }, (error: Error) => {
            console.log(error);
          }
        );
      }, (error: Error) => {
        console.log(error);
      }
    );
  }

  updateExpense(expenseId: number): void {
    this.expenseEdit.amount = this.expenseForm.get("amount_edit").value;
    this.expenseEdit.date = this.expenseForm.get("date_edit").value;
    this.expenseEdit.place = this.expenseForm.get("place_edit").value;
    this.expenseEdit.forPerson = this.expenseForm.get("forPerson_edit").value;
    this.expenseEdit.cardId = this.expenseForm.get("paymentMethod_edit").value;
    this.expenseEdit.id = expenseId > 0 ? expenseId : expenseId * -1;

    this._expenseEventService.updateExpense(this.expenseEdit, this.event.id).subscribe(
      (res) => {
        this._expenseEventService.getEventExpenses(this.expenseId).subscribe(
          (event) => {
            this.event = event;
            this.resetFormValues();
          }, (error) => {
            console.log(error);
          }
        );
      }, (error) => {
        console.log(error);
      }
    );
  }

  closeUpdateExpense(expense: EventExpense): void {
    expense.id = expense.id * -1;
    this.idUpdate = this.idUpdate * -1;
  }

  openUpdateExpense(expense: EventExpense): void {
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
      let exp = this.event.expenses.find(x => x.id == this.idUpdate);
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
  }

  openOrCloseUpdateExpense(expense: EventExpense): void {
    // console.log(event);
    if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
      let exp = this.event.expenses.find(x => x.id == this.idUpdate);
      exp.id = exp.id * -1;
    }
    expense.id = expense.id * -1;
    this.idUpdate = expense.id;
    this.expenseForm.get("amount_edit").setValue(expense.amount);
    this.expenseForm.get("date_edit").setValue(expense.date);
    this.expenseForm.get("place_edit").setValue(expense.place);
    this.expenseForm.get("forPerson_edit").setValue(expense.forPerson);
    this.expenseForm.get("paymentMethod_edit").setValue(expense.cardId);
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
      forPerson_edit: ''
    });
    this.idUpdate = undefined;
  }
}