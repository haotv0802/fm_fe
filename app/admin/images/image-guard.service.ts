import {CanActivate, Router, ActivatedRouteSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {ImagesUpdateService} from "./imagesUpdate.service";
import {Image} from "./image";

@Injectable()
export class ImageDetailsGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _imageUpdateService: ImagesUpdateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Comments for reference
    // console.log("url: " + route.url);              // -> admin,images,update
    // console.log("url: " + route.routeConfig.path); // -> admin/images/update
    // console.log(route.queryParams['id']);          // -> example: /images?id=1
    if (!this._imageUpdateService.image && !route.queryParams['id']) {
      this._router.navigate(["admin/images"]);
      return false;
    } else if (!this._imageUpdateService.image && route.queryParams['id']) {
      return true;
      // let id = route.queryParams['id'];
      // this._imageUpdateService.getImageById(id).subscribe(
      //   (res) => {
      //     console.log("this._imageUpdateService.image = res");
      //     console.log(res);
      //     this._imageUpdateService.image = res;
      //     return true;
      //   },
      //   (error) => {
      //     console.log(error);
      //     this._router.navigate(["admin/images"]);
      //     return false;
      //   }
      // );
    } else {
      return true;
    }
  }
}