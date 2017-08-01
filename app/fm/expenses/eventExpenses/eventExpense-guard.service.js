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
var HTTP_service_1 = require("../../../common/HTTP.service");
var constant_1 = require("../../../common/constant");
var EventExpenseGuard = (function () {
    function EventExpenseGuard(_router, _httpService, _constants) {
        this._router = _router;
        this._httpService = _httpService;
        this._constants = _constants;
    }
    EventExpenseGuard.prototype.canActivate = function (route) {
        var _this = this;
        var id = +route.url[1].path;
        if (isNaN(id)) {
            // alert('Invalid expense Id');
            // start a new navigation to redirect to list page
            this._router.navigate(['/expenses']);
            // abort current navigation
            return false;
        }
        // return this._eventExpenseService.checkEventExpenses(id).subscribe(
        //   (res) => {
        //       console.log(res);
        //       if (res == false) {
        //         this._router.navigate(['/expenses']);
        //         return false;
        //       }
        //       return true;
        //   }, (error) => {
        //     console.log(error);
        //     this._router.navigate(['/expenses']);
        //     return false;
        //   }
        // );
        // return this._eventExpenseService.checkEventExpenses(id);
        if (id > 0) {
            return this._httpService.get(this._constants.EVENT_EXPENSES_SERVICE_URL + ("/" + id + "/check"))
                .map(function (res) {
                var isExisting = res.json().isEventExisting;
                if (isExisting == false) {
                    _this._router.navigate(['/expenses']);
                }
                return isExisting;
            });
        }
        else {
            return true;
        }
    };
    EventExpenseGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router,
            HTTP_service_1.HTTPService,
            constant_1.Constants])
    ], EventExpenseGuard);
    return EventExpenseGuard;
}());
exports.EventExpenseGuard = EventExpenseGuard;
//# sourceMappingURL=eventExpense-guard.service.js.map