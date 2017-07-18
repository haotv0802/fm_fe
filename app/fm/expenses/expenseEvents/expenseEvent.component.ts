import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {ExpenseEventService} from "./expenseEvent.service";

@Component({
  moduleId: module.id,
  templateUrl: 'expenseEvent.component.html'
})
export class ExpenseEventComponent implements OnInit {
  pageTitle: string;

  constructor(
    private _expenseEventService: ExpenseEventService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.pageTitle = 'Expense Event';
  }

  ngOnInit(): void {

  }

}
