import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {WelcomeComponent} from "./common/home/welcome.component";
import {NavComponent} from "./nav.component";
import {LoginModule} from "./common/login/login.module";
import {ProductModule} from "./products/product.module";
import {Constants} from "./common/constant";
import {HTTPService} from "./common/HTTP.service";
import {HTCommonModule} from "./common/htCommon.module";
import {ToasterModule} from "angular2-toaster";
import {ModalModule} from "angular2-modal";
import {BootstrapModalModule} from "angular2-modal/plugins/bootstrap";
import {MessagesService} from "./common/messages/messages.service";
import {FmModule} from "./fm/fm.module";
import {NgxMyDatePickerModule} from "ngx-mydatepicker";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {path: 'welcome', component: WelcomeComponent},
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      // {path: '**', redirectTo: 'welcome', pathMatch: 'full'}
    ]),
    LoginModule,
    ProductModule,
    FmModule,
    HTCommonModule,
    ToasterModule,
    ModalModule.forRoot(),
    BootstrapModalModule

  ],
  declarations: [
    AppComponent,
    WelcomeComponent,
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
