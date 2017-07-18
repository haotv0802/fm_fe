import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {HTCommonModule} from "../../common/htCommon.module";
import {ExpensesComponent} from "./expenses.component";
import {ExpensesService} from "./expenses.service";
import {ReactiveFormsModule} from "@angular/forms";
import {EventExpenseComponent} from "./eventExpenses/eventExpense.component";
import {EventExpenseGuard} from "./eventExpenses/eventExpense-guard.service";
import {EventExpenseService} from "./eventExpenses/eventExpense.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'expenses', component: ExpensesComponent},
      {path: 'expenses/:expenseId', canActivate: [EventExpenseGuard], component: EventExpenseComponent}
    ]),
    CommonModule,
    Ng2SmartTableModule,
    HTCommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    ExpensesComponent,
    EventExpenseComponent
  ],
  providers: [
    ExpensesService,
    EventExpenseService,
    EventExpenseGuard
  ]
})
export class ExpensesModule {
}