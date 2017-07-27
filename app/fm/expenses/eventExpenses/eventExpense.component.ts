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
  expensesForm: FormGroup;
  expenseEdit: EventExpense = new EventExpense();
  expenseId: number;
  @ViewChild(ModalComponent) modal: ModalComponent;
  event: Event;

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
    this.expenseEdit.amount = this.expensesForm.get("amount").value;
    this.expenseEdit.date = this.expensesForm.get("date").value;
    this.expenseEdit.place = this.expensesForm.get("place").value;
    // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
    this.expenseEdit.forPerson = this.expensesForm.get("forPerson").value;
    this.expenseEdit.cardId = this.expensesForm.get("paymentMethod").value;

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

  deleteExpense(expenseId: number, eventId: number): void {
    this._expenseEventService.deleteExpense(expenseId, eventId).subscribe(
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

  updateExpense(eventId: number): void {
    // this._expenseEventService.updateExpense(eventId).subscribe(
    //   (res) => {
    //
    //   }, (error: Error) => {
    //     console.log(error);
    //   }
    // );
  }

  resetFormValues(): void {
    this.expensesForm.setValue({
      amount: '',
      date: '',
      place: '',
      paymentMethod: '',
      forPerson: ''
    });
  }
}
