import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {WelcomeComponent} from "./common/home/welcome.component";
import {StaffComponent} from "./staff/staff.component";
import {NavComponent} from "./nav.component";
import {LoginModule} from "./common/login/login.module";
import {AdminModule} from "./admin/admin.module";
import {ProductModule} from "./products/product.module";
import {Constants} from "./common/constant";
import {HTTPService} from "./common/HTTP.service";
import {HTCommonModule} from "./common/htCommon.module";
import {ToasterModule} from "angular2-toaster";
import {ModalModule} from "angular2-modal";
import {BootstrapModalModule} from "angular2-modal/plugins/bootstrap";
import {MessagesService} from "./common/messages/messages.service";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {path: 'welcome', component: WelcomeComponent},
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      // {path: '**', redirectTo: 'welcome', pathMatch: 'full'}
    ]),
    RouterModule.forChild([
      {path: 'staff', component: StaffComponent}
    ]),
    LoginModule,
    ProductModule,
    AdminModule,
    HTCommonModule,
    ToasterModule,
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  declarations: [
    AppComponent,
    WelcomeComponent,
    StaffComponent,
    NavComponent
  ],
  providers: [
    Constants,
    MessagesService,
    HTTPService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
