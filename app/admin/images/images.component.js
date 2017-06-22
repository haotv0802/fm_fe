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
var core_1 = require("@angular/core");
var images_service_1 = require("./images.service");
var router_1 = require("@angular/router");
var imagesUpdate_service_1 = require("./imagesUpdate.service");
var constant_1 = require("../../common/constant");
var ImagesComponent = (function () {
    function ImagesComponent(_imagesService, _router, _imageUpdateService, _constants) {
        this._imagesService = _imagesService;
        this._router = _router;
        this._imageUpdateService = _imageUpdateService;
        this._constants = _constants;
        this.pageTitle = 'Images Management';
        // this.getImages();
    }
    ImagesComponent.prototype.ngOnInit = function () {
        console.log("get images in ngOnInit");
        this.getImages();
    };
    ImagesComponent.prototype.ngOnDestroy = function () {
    };
    ImagesComponent.prototype.displayImage = function (image) {
        console.log(image);
    };
    ImagesComponent.prototype.editImage = function (image) {
        this._imageUpdateService.image = image;
        this._router.navigate(["admin/images/update"]);
    };
    ImagesComponent.prototype.getImages = function () {
        var _this = this;
        this._imagesService.getImages().subscribe(function (images) {
            _this.images = images;
            var _loop_1 = function (i) {
                var imgTmp = _this.images[i];
                _this._imagesService.getImageFile(imgTmp.id)
                    .subscribe(function (res) {
                    // console.log("res.headers.content-type");
                    // console.log(res.headers);
                    // console.log(res.headers.get('content-type'));
                    // imgTmp.imageURL = "data:image/jpeg;base64," + res.json().encodedString;
                    imgTmp.imageURL = "data:" + res.headers.get('content-type') + ";base64," + res.json().encodedString;
                }, function (error) {
                    console.log(error);
                });
            };
            for (var i = 0; i < _this.images.length; i++) {
                _loop_1(i);
            }
            // $('.carousel').carousel();
        }, function (error) {
            console.log("images component - get images - Error:");
            console.log(error);
        });
    };
    ImagesComponent.prototype.hexToBase64 = function (str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    };
    ImagesComponent.prototype.getImageFile = function (image) {
        this._imagesService.getImageFile(image.id)
            .subscribe(function (res) {
            console.log("res");
            console.log(res.encodedString);
            // console.log("====");
            // console.log(JSON.stringify(res));
            image.imageURL = "data:image/jpeg;base64," + res.encodedString;
        }, function (error) {
            console.log(error);
        });
    };
    ImagesComponent.prototype.counter = function (length) {
        return new Array(length);
    };
    ImagesComponent.prototype.isActive = function (url) {
        return url === this.images[0].imageURL;
        // return url;
    };
    return ImagesComponent;
}());
ImagesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'images.component.html',
        styleUrls: ['images.component.01.css', 'images.component.02.css']
    }),
    __metadata("design:paramtypes", [images_service_1.ImagesService,
        router_1.Router,
        imagesUpdate_service_1.ImagesUpdateService,
        constant_1.Constants])
], ImagesComponent);
exports.ImagesComponent = ImagesComponent;
//# sourceMappingURL=images.component.js.map