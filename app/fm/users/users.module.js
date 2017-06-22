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
var usersUpdate_component_1 = require("./usersUpdate.component");
var users_component_1 = require("./users.component");
var users_service_1 = require("./users.service");
var common_1 = require("@angular/common");
var ng2_smart_table_1 = require("ng2-smart-table");
var usersUpdate_service_1 = require("./usersUpdate.service");
var htCommon_module_1 = require("../../common/htCommon.module");
var UsersModule = (function () {
    function UsersModule() {
    }
    return UsersModule;
}());
UsersModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild([
                { path: 'admin/users', component: users_component_1.UsersComponent },
                { path: 'admin/usersUpdate', component: usersUpdate_component_1.UsersUpdateComponent }
            ]),
            common_1.CommonModule,
            ng2_smart_table_1.Ng2SmartTableModule,
            htCommon_module_1.HTCommonModule
        ],
        declarations: [
            users_component_1.UsersComponent,
            usersUpdate_component_1.UsersUpdateComponent
        ],
        providers: [
            users_service_1.UsersService,
            usersUpdate_service_1.UsersUpdateService
        ]
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map