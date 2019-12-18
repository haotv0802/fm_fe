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
      { path: '', redirectTo: 'expenses', pathMatch: 'full' },
      { path: 'cities', component: CitiesComponent },
      { path: 'expenses', component: ExpensesComponent }
    ]),
    LoginModule
  ],
  providers: [
    HTTPService,
    ExpensesService,
    Constants
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
