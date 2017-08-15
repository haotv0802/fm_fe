import {NgModule} from "@angular/core";
import {ExpensesModule} from "./expenses/expenses.module";
import {LcDatePickerModule} from "@libusoftcicom/lc-datepicker";

@NgModule({
  imports: [
    ExpensesModule,
    LcDatePickerModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: []
})
export class FmModule {
}