"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var users_module_1 = require("./users/users.module");
var rooms_module_1 = require("./rooms/rooms.module");
var images_module_1 = require("./images/images.module");
var domain_service_1 = require("./common/domain.service");
var individuals_module_1 = require("./individuals/individuals.module");
var AdminModule = (function () {
    function AdminModule() {
    }
    return AdminModule;
}());
AdminModule = __decorate([
    core_1.NgModule({
        imports: [
            users_module_1.UsersModule,
            rooms_module_1.RoomsModule,
            images_module_1.ImagesModule,
            individuals_module_1.IndividualsModule
        ],
        declarations: [],
        exports: [],
        providers: [domain_service_1.DomainService]
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map