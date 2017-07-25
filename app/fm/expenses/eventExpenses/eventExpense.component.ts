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
import {ExpensesDetailsPresenter} from "../expensesDetailsPresenter";
import {Expense} from "./expense";

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
  expenseEdit: Expense = new Expense();
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
        console.log("expenseId: " + this.expenseId);
        this._expenseEventService.getEventExpenses(this.expenseId).subscribe(
          (event) => {
            this.event = event;
            console.log("event: ");
            console.log(this.event);
          }, (error) => {
            console.log(error);
          }
        );
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
    console.log(this.expenseEdit);

    this.loaderOpen = true;
    Observable.forkJoin(
      this._expenseEventService.addExpense(this.expenseEdit, this.expenseId),
      this._expenseEventService.getEventExpenses(this.expenseId),
      this._expensesService.getPaymentMethods()
    ).subscribe(
      (data) => {
        console.log(data[0]);
        this.event = data[1];
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
