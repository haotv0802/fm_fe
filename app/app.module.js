"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var app_component_1 = require("./app.component");
var welcome_component_1 = require("./common/home/welcome.component");
var nav_component_1 = require("./nav.component");
var login_module_1 = require("./common/login/login.module");
var product_module_1 = require("./products/product.module");
var constant_1 = require("./common/constant");
var HTTP_service_1 = require("./common/HTTP.service");
var htCommon_module_1 = require("./common/htCommon.module");
var angular2_toaster_1 = require("angular2-toaster");
var angular2_modal_1 = require("angular2-modal");
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var messages_service_1 = require("./common/messages/messages.service");
var fm_module_1 = require("./fm/fm.module");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                router_1.RouterModule.forRoot([
                    { path: 'welcome', component: welcome_component_1.WelcomeComponent },
                    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
                ]),
                login_module_1.LoginModule,
                product_module_1.ProductModule,
                fm_module_1.FmModule,
                htCommon_module_1.HTCommonModule,
                angular2_toaster_1.ToasterModule,
                angular2_modal_1.ModalModule.forRoot(),
                bootstrap_1.BootstrapModalModule
            ],
            declarations: [
                app_component_1.AppComponent,
                welcome_component_1.WelcomeComponent,
                nav_component_1.NavComponent
            ],
            providers: [
                constant_1.Constants,
                messages_service_1.MessagesService,
                HTTP_service_1.HTTPService
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map