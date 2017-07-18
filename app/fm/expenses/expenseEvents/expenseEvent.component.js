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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var expenseEvent_service_1 = require("./expenseEvent.service");
var ExpenseEventComponent = (function () {
    function ExpenseEventComponent(_expenseEventService, _router, fb) {
        this._expenseEventService = _expenseEventService;
        this._router = _router;
        this.fb = fb;
        this.pageTitle = 'Expense Event';
    }
    ExpenseEventComponent.prototype.ngOnInit = function () {
    };
    return ExpenseEventComponent;
}());
ExpenseEventComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'expenseEvent.component.html'
    }),
    __metadata("design:paramtypes", [expenseEvent_service_1.ExpenseEventService,
        router_1.Router,
        forms_1.FormBuilder])
], ExpenseEventComponent);
exports.ExpenseEventComponent = ExpenseEventComponent;
//# sourceMappingURL=expenseEvent.component.js.map