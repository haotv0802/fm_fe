import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginService} from './login.service';
import {LoginComponent} from './login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FmTableComponent} from '../fmtags/table/fm.table.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'login', component: LoginComponent}
    ]),
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    FmTableComponent
  ],
  exports: [
    FmTableComponent
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule {
}
