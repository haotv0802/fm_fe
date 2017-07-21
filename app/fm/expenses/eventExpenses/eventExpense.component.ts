import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {Subscription} from "rxjs/Subscription";
import {PaymentMethod} from "../paymentMethod";
import {Expense} from "../expense";
import {ModalComponent} from "../../../common/modal/modal.component";
import {ExpensesService} from "../expenses.service";
import {EventExpenseService} from "./eventExpense.service";
import {Event} from "./event";

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
        let expenseId = +params['expenseId'];
        console.log("expenseId: " + expenseId);
        this._expenseEventService.getEventExpenses(expenseId).subscribe(
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
}
