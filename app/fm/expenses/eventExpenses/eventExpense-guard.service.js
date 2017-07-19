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
var eventExpense_service_1 = require("./eventExpense.service");
var EventExpenseGuard = (function () {
    function EventExpenseGuard(_router, _eventExpenseService) {
        this._router = _router;
        this._eventExpenseService = _eventExpenseService;
    }
    EventExpenseGuard.prototype.canActivate = function (route) {
        var _this = this;
        var id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            // alert('Invalid expense Id');
            // start a new navigation to redirect to list page
            this._router.navigate(['/expenses']);
            // abort current navigation
            return false;
        }
        this._eventExpenseService.checkEventExpenses(id).subscribe(function (res) {
            console.log(res);
            if (res == true) {
                return true;
            }
            else {
                _this._router.navigate(['/expenses']);
                return false;
            }
        }, function (error) {
            console.log(error);
            _this._router.navigate(['/expenses']);
            return false;
        });
    };
    return EventExpenseGuard;
}());
EventExpenseGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router,
        eventExpense_service_1.EventExpenseService])
], EventExpenseGuard);
exports.EventExpenseGuard = EventExpenseGuard;
//# sourceMappingURL=eventExpense-guard.service.js.map