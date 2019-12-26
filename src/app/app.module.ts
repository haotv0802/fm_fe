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

@NgModule({
  declarations: [
    AppComponent,
    CitiesComponent,
    ExpensesComponent,
    ModalComponent,
    OpenDirective,
    LoaderModalComponent
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
      {path: 'moneyflow', component: ExpensesComponent}
    ]),
    LoginModule,
    ToasterModule
  ],
  providers: [
    HTTPService,
    ExpensesService,
    Constants,
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
