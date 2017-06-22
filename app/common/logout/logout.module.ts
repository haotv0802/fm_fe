import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LogoutService} from './logout.service';
import {LogoutComponent} from './logout.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'logout', component: LogoutComponent}
    ]),
    FormsModule,
    CommonModule
  ],
  declarations: [
    LogoutComponent
  ],
  providers: [
    LogoutService
  ]
})
export class LogoutModule {
}