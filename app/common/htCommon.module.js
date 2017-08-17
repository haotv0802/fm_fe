"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var alert_component_1 = require("../common/modal/alert.component");
var open_component_1 = require("../common/modal/open.component");
var modal_component_1 = require("./modal/modal.component");
var common_1 = require("@angular/common");
var loader_modal_component_1 = require("./modal/loaderModal/loader.modal.component");
var loader_component_1 = require("./loader/loader.component");
var ngx_mydatepicker_1 = require("ngx-mydatepicker");
var HTCommonModule = (function () {
    function HTCommonModule() {
    }
    HTCommonModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [
                alert_component_1.AlertComponent,
                open_component_1.OpenDirective,
                modal_component_1.ModalComponent,
                loader_modal_component_1.LoaderModalComponent,
                loader_component_1.LoaderComponent
            ],
            exports: [
                alert_component_1.AlertComponent,
                open_component_1.OpenDirective,
                modal_component_1.ModalComponent,
                loader_modal_component_1.LoaderModalComponent,
                common_1.CommonModule,
                loader_component_1.LoaderComponent,
                ngx_mydatepicker_1.NgxMyDatePickerModule
            ],
            providers: []
        })
    ], HTCommonModule);
    return HTCommonModule;
}());
exports.HTCommonModule = HTCommonModule;
//# sourceMappingURL=htCommon.module.js.map