import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {UsersUpdateComponent} from "./usersUpdate.component";
import {UsersComponent} from "./users.component";
import {UsersService} from "./users.service";
import {CommonModule} from "@angular/common";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {UsersUpdateService} from "./usersUpdate.service";
import {HTCommonModule} from "../../common/htCommon.module";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'admin/users', component: UsersComponent},
      {path: 'admin/usersUpdate', component: UsersUpdateComponent}
    ]),
    CommonModule,
    Ng2SmartTableModule,
    HTCommonModule
  ],
  declarations: [
    UsersComponent,
    UsersUpdateComponent
  ],
  providers: [
    UsersService,
    UsersUpdateService
  ]
})
export class UsersModule {
}