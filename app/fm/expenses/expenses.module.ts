import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {HTCommonModule} from "../../common/htCommon.module";
import {ExpensesComponent} from "./expenses.component";
import {ExpensesService} from "./expenses.service";
import {ReactiveFormsModule} from "@angular/forms";
import {ExpenseEventComponent} from "./expenseEvents/expenseEvent.component";
import {ExpenseEventService} from "./expenseEvents/expenseEvent.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'expenses', component: ExpensesComponent},
      {path: 'expenses/:expenseId', component: ExpenseEventComponent}
    ]),
    CommonModule,
    Ng2SmartTableModule,
    HTCommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    ExpensesComponent,
    ExpenseEventComponent
  ],
  providers: [
    ExpensesService,
    ExpenseEventService
  ]
})
export class ExpensesModule {
}