"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var expenses_module_1 = require("./expenses/expenses.module");
var FmModule = (function () {
    function FmModule() {
    }
    FmModule = __decorate([
        core_1.NgModule({
            imports: [
                expenses_module_1.ExpensesModule
            ],
            declarations: [],
            exports: [],
            providers: []
        })
    ], FmModule);
    return FmModule;
}());
exports.FmModule = FmModule;
//# sourceMappingURL=fm.module.js.map