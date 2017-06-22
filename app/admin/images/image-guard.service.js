"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var imagesUpdate_service_1 = require("./imagesUpdate.service");
var ImageDetailsGuard = (function () {
    function ImageDetailsGuard(_router, _imageUpdateService) {
        this._router = _router;
        this._imageUpdateService = _imageUpdateService;
    }
    ImageDetailsGuard.prototype.canActivate = function (route) {
        // Comments for reference
        // console.log("url: " + route.url);              // -> admin,images,update
        // console.log("url: " + route.routeConfig.path); // -> admin/images/update
        // console.log(route.queryParams['id']);          // -> example: /images?id=1
        if (!this._imageUpdateService.image && !route.queryParams['id']) {
            this._router.navigate(["admin/images"]);
            return false;
        }
        else if (!this._imageUpdateService.image && route.queryParams['id']) {
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
        }
        else {
            return true;
        }
    };
    return ImageDetailsGuard;
}());
ImageDetailsGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router,
        imagesUpdate_service_1.ImagesUpdateService])
], ImageDetailsGuard);
exports.ImageDetailsGuard = ImageDetailsGuard;
//# sourceMappingURL=image-guard.service.js.map