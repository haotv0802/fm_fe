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
///<reference path="../../common/HTTP.service.ts"/>
var core_1 = require("@angular/core");
var constant_1 = require("../../common/constant");
var HTTP_service_1 = require("../../common/HTTP.service");
var ImagesUpdateService = (function () {
    function ImagesUpdateService(_httpService, _constants) {
        this._httpService = _httpService;
        this._constants = _constants;
    }
    ImagesUpdateService.prototype.getImageById = function (id) {
        return this._httpService.get(this._constants.ADMIN_IMAGES_SERVICE_URL + ("/" + id + "/info"))
            .map(function (res) { return res.json(); });
    };
    ImagesUpdateService.prototype.updateImage = function (image) {
        return this._httpService.post(this._constants.ADMIN_IMAGE_UPDATE_SERVICE_URL, image);
    };
    ImagesUpdateService.prototype.updateImageFile = function (id, imageFile) {
        return this._httpService.postImageFile(this._constants.HOST + ("/admin/images/" + id + "/updateImage"), imageFile);
    };
    return ImagesUpdateService;
}());
ImagesUpdateService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [HTTP_service_1.HTTPService,
        constant_1.Constants])
], ImagesUpdateService);
exports.ImagesUpdateService = ImagesUpdateService;
//# sourceMappingURL=imagesUpdate.service.js.map