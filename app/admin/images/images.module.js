"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var images_component_1 = require("./images.component");
var images_service_1 = require("./images.service");
var imagesUpdate_component_1 = require("./imagesUpdate.component");
var forms_1 = require("@angular/forms");
var imagesUpdate_service_1 = require("./imagesUpdate.service");
var image_guard_service_1 = require("./image-guard.service");
var htCommon_module_1 = require("../../common/htCommon.module");
var ImagesModule = (function () {
    function ImagesModule() {
    }
    return ImagesModule;
}());
ImagesModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild([
                { path: 'admin/images', component: images_component_1.ImagesComponent },
                {
                    path: 'admin/images/update',
                    canActivate: [image_guard_service_1.ImageDetailsGuard],
                    component: imagesUpdate_component_1.ImagesUpdateComponent
                }
            ]),
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            htCommon_module_1.HTCommonModule
        ],
        declarations: [
            images_component_1.ImagesComponent,
            imagesUpdate_component_1.ImagesUpdateComponent,
        ],
        providers: [images_service_1.ImagesService, imagesUpdate_service_1.ImagesUpdateService, image_guard_service_1.ImageDetailsGuard]
    })
], ImagesModule);
exports.ImagesModule = ImagesModule;
//# sourceMappingURL=images.module.js.map