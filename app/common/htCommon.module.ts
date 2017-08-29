import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {AlertComponent} from "../common/modal/alert.component";
import {OpenDirective} from "../common/modal/open.component";
import {ModalComponent} from "./modal/modal.component";
import {CommonModule} from "@angular/common";
import {LoaderModalComponent} from "./modal/loaderModal/loader.modal.component";
import {LoaderComponent} from "./loader/loader.component";
import {NgxMyDatePickerModule} from "ngx-mydatepicker";

@NgModule({
  imports: [CommonModule],
  declarations: [
    AlertComponent,
    OpenDirective,
    ModalComponent,
    LoaderModalComponent,
    LoaderComponent
  ],
  exports: [
    AlertComponent,
    OpenDirective,
    ModalComponent,
    LoaderModalComponent,
    CommonModule,
    LoaderComponent,
    NgxMyDatePickerModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class HTCommonModule {
}