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
var modal_component_1 = require("../../common/modal/modal.component");
var expenses_service_1 = require("./expenses.service");
var ExpensesComponent = (function () {
    function ExpensesComponent(_usersService, _router) {
        this._usersService = _usersService;
        this._router = _router;
        this.loaderOpen = true;
        this.pageTitle = 'Expenses';
    }
    ExpensesComponent.prototype.ngOnInit = function () {
        this.getExpenses();
        this.getExpensesDetails();
    };
    ExpensesComponent.prototype.getExpenses = function () {
        var _this = this;
        this._usersService.getExpenses().subscribe(function (expenses) {
            _this.expenses = expenses;
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.getExpensesDetails = function () {
        var _this = this;
        this._usersService.getExpensesDetails().subscribe(function (expensesDetails) {
            _this.expensesDetails = expensesDetails;
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.editUser = function () {
        // this._router.navigate(["admin/usersUpdate"]);
        // this.popupUsersUpdate();
    };
    return ExpensesComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], ExpensesComponent.prototype, "modal", void 0);
ExpensesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'expenses.component.html'
    }),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService,
        router_1.Router])
], ExpensesComponent);
exports.ExpensesComponent = ExpensesComponent;
//# sourceMappingURL=expenses.component.js.map