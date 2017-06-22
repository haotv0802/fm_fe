import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ImagesComponent} from "./images.component";
import {ImagesService} from "./images.service";
import {ImagesUpdateComponent} from "./imagesUpdate.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ImagesUpdateService} from "./imagesUpdate.service";
import {ImageDetailsGuard} from "./image-guard.service";
import {HTCommonModule} from "../../common/htCommon.module";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'admin/images', component: ImagesComponent},
      {
        path: 'admin/images/update',
        canActivate: [ImageDetailsGuard],
        component: ImagesUpdateComponent
      }
    ]),
    CommonModule,
    ReactiveFormsModule,
    HTCommonModule
  ],
  declarations: [
    ImagesComponent,
    ImagesUpdateComponent,
  ],
  providers: [ImagesService, ImagesUpdateService, ImageDetailsGuard]
})
export class ImagesModule {
}