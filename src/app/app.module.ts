import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CitiesComponent } from './cities/cities.component';
import { ExpensesComponent } from './expenses/expenses.component';
import {HTTPService} from './common/HTTP.service';
import {LoginModule} from './common/login/login.module';
import {ExpensesService} from './expenses/expenses.service';
import {Constants} from './common/constant';
import {ToasterModule} from 'angular2-toaster';
import {MessagesService} from './common/messages/messages.service';

@NgModule({
  declarations: [
    AppComponent,
    CitiesComponent,
    ExpensesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'moneyflow', component: ExpensesComponent }
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
export class AppModule { }
