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
var HTTP_service_1 = require("../../../common/HTTP.service");
var constant_1 = require("../../../common/constant");
var EventExpenseService = (function () {
    function EventExpenseService(_httpService, _constants) {
        this._httpService = _httpService;
        this._constants = _constants;
    }
    EventExpenseService.prototype.checkEventExpenses = function (expenseId) {
        return this._httpService.get(this._constants.EVENT_EXPENSES_SERVICE_URL + ("/" + expenseId + "/check"))
            .map(function (res) {
            return res.json().isEventExisting;
        });
    };
    EventExpenseService.prototype.getEventExpenses = function (expenseId) {
        return this._httpService.get(this._constants.EVENT_EXPENSES_SERVICE_URL + ("/" + expenseId))
            .map(function (res) {
            return res.json();
        });
    };
    EventExpenseService.prototype.addExpense = function (expense, expenseId) {
        return this._httpService.post(this._constants.EVENT_EXPENSES_SERVICE_URL + ("/" + expenseId), expense)
            .map(function (res) { return res.json(); });
    };
    EventExpenseService.prototype.updateExpense = function (expense, expenseId) {
        console.log(expense);
        return this._httpService.patch(this._constants.EVENT_EXPENSES_SERVICE_URL + ("/" + expenseId + "/" + expense.id), expense)
            .map(function (res) { return res.json(); });
    };
    EventExpenseService.prototype.deleteExpense = function (expenseId, eventExpenseId) {
        return this._httpService.delete(this._constants.EVENT_EXPENSES_SERVICE_URL + ("/" + expenseId + "/" + eventExpenseId))
            .map(function (res) { return res.json(); });
    };
    EventExpenseService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [HTTP_service_1.HTTPService,
            constant_1.Constants])
    ], EventExpenseService);
    return EventExpenseService;
}());
exports.EventExpenseService = EventExpenseService;
//# sourceMappingURL=eventExpense.service.js.map