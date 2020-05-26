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
///<reference path="../../common/constant.ts"/>
var core_1 = require("@angular/core");
var constant_1 = require("../../common/constant");
var HTTP_service_1 = require("../../common/HTTP.service");
var ExpensesService = (function () {
    function ExpensesService(_httpService, _constants) {
        this._httpService = _httpService;
        this._constants = _constants;
    }
    ExpensesService.prototype.addExpense = function (expense) {
        return this._httpService.post(this._constants.EXPENSES_SERVICE_URL, expense)
            .map(function (res) { return res.json(); });
    };
    ExpensesService.prototype.deleteExpense = function (expenseId) {
        return this._httpService.delete(this._constants.EXPENSES_SERVICE_URL + ("/" + expenseId + "/delete"))
            .map(function (res) { return res.json(); });
    };
    ExpensesService.prototype.updateExpense = function (expense) {
        return this._httpService.patch(this._constants.EXPENSES_SERVICE_URL, expense)
            .map(function (res) { return res.json(); });
    };
    ExpensesService.prototype.getExpenses = function () {
        return this._httpService.get(this._constants.EXPENSES_SERVICE_URL)
            .map(function (res) { return res.json(); });
    };
    ExpensesService.prototype.getPaymentMethods = function () {
        return this._httpService.get(this._constants.PAYMENT_METHODS_SERVICE_URL)
            .map(function (res) { return res.json(); });
    };
    ExpensesService.prototype.updateExpenseAmount = function (expenseId, amount) {
        return this._httpService.get(this._constants.EXPENSES_SERVICE_URL + ("/" + expenseId + "/" + amount + "/updateAmount"))
            .map(function (res) {
            return res.json();
        });
    };
    ExpensesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [HTTP_service_1.HTTPService,
            constant_1.Constants])
    ], ExpensesService);
    return ExpensesService;
}());
exports.ExpensesService = ExpensesService;
//# sourceMappingURL=expenses.service.js.map