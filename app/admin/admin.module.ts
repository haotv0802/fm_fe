import {NgModule} from "@angular/core";
import {UsersModule} from "./users/users.module";
import {RoomsModule} from "./rooms/rooms.module";
import {ImagesModule} from "./images/images.module";
import {DomainService} from "./common/domain.service";
import {IndividualsModule} from "./individuals/individuals.module";

@NgModule({
  imports: [
    UsersModule,
    RoomsModule,
    ImagesModule,
    IndividualsModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [DomainService]
})
export class AdminModule {
}