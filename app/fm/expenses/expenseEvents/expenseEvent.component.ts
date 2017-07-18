import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {ExpenseEventService} from "./expenseEvent.service";
import {Subscription} from "rxjs/Subscription";
import {PaymentMethod} from "../paymentMethod";
import {ExpensesDetails} from "../expensesDetails";
import {Expense} from "../expense";
import {ModalComponent} from "../../../common/modal/modal.component";
import {ExpensesService} from "../expenses.service";

@Component({
  moduleId: module.id,
  templateUrl: 'expenseEvent.component.html'
})
export class ExpenseEventComponent implements OnInit {
  pageTitle: string;
  private sub: Subscription;
  paymentMethods: PaymentMethod[];
  expensesDetails: ExpensesDetails;
  loaderOpen: boolean = true;
  expensesForm: FormGroup;
  expenseEdit: Expense = new Expense();
  @ViewChild(ModalComponent) modal: ModalComponent;

  constructor(
    private _expenseEventService: ExpenseEventService,
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
      });
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

}
