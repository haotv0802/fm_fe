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
var logout_service_1 = require("./logout.service");
var logout_component_1 = require("./logout.component");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var LogoutModule = (function () {
    function LogoutModule() {
    }
    LogoutModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forChild([
                    { path: 'logout', component: logout_component_1.LogoutComponent }
                ]),
                forms_1.FormsModule,
                common_1.CommonModule
            ],
            declarations: [
                logout_component_1.LogoutComponent
            ],
            providers: [
                logout_service_1.LogoutService
            ]
        })
    ], LogoutModule);
    return LogoutModule;
}());
exports.LogoutModule = LogoutModule;
//# sourceMappingURL=logout.module.js.map