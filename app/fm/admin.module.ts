import {NgModule} from "@angular/core";
import {UsersModule} from "./users/users.module";
import {DomainService} from "./common/domain.service";

@NgModule({
  imports: [
    UsersModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [DomainService]
})
export class AdminModule {
}