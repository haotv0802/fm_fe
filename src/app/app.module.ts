import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {CitiesComponent} from './cities/cities.component';
import {ExpensesComponent} from './expenses/expenses.component';
import {HTTPService} from './common/HTTP.service';
import {LoginModule} from './common/login/login.module';
import {ExpensesService} from './expenses/expenses.service';
import {Constants} from './common/constant';
import {ToasterModule} from 'angular2-toaster';
import {MessagesService} from './common/messages/messages.service';
import {ModalComponent} from './common/modal/modal.component';
import {LoaderModalComponent} from './common/modal/loaderModal/loader.modal.component';
import {NgxMyDatePickerModule} from "ngx-mydatepicker";
import {OpenDirective} from './common/modal/open.component';
import {MyDatePickerModule} from 'mydatepicker';
import {ExpenseItem} from './expenses/modals/expenseItem';
import {IndividualService} from './individual/individual.service';
import {IndividualComponent} from './individual/individual.component';
import {BankService} from './bank/bank.service';
import {MoneySourceComponent} from './individual/modals/moneySource.component';
import {PaymentMethodService} from './payment/paymentMethod.service';
import {PromotionComponent} from './promotions/promotion.component';
import {PromotionService} from './promotions/promotion.service';
import {CategoryService} from './category/category.service';

@NgModule({
  declarations: [
    AppComponent,
    CitiesComponent,
    ExpensesComponent,
    IndividualComponent,
    ModalComponent,
    OpenDirective,
    LoaderModalComponent,
    ExpenseItem,
    MoneySourceComponent,
    PromotionComponent
  ],
  exports: [
    LoaderModalComponent,
    OpenDirective,
    NgxMyDatePickerModule
  ],
  imports: [
    MyDatePickerModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxMyDatePickerModule.forRoot(),
    RouterModule.forRoot([
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'moneyflow', component: ExpensesComponent},
      {path: 'individual', component: IndividualComponent},
      {path: 'promotion', component: PromotionComponent}
    ]),
    LoginModule,
    ToasterModule
  ],
  providers: [
    HTTPService,
    ExpensesService,
    IndividualService,
    BankService,
    Constants,
    MessagesService,
    PaymentMethodService,
    PromotionService,
    CategoryService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent, ExpenseItem, MoneySourceComponent]
})
export class AppModule {
}
