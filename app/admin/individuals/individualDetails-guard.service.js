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
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var individualDetails_service_1 = require("./individualDetails.service");
var IndividualDetailsGuard = (function () {
    function IndividualDetailsGuard(_router, _individualDetailsService) {
        this._router = _router;
        this._individualDetailsService = _individualDetailsService;
    }
    IndividualDetailsGuard.prototype.canActivate = function (route) {
        console.log("url: " + route.url);
        console.log("url: " + route.routeConfig.path);
        if (!this._individualDetailsService.individual) {
            this._router.navigate(["admin/individuals"]);
            console.log("In Individual Guard, return false");
            return false;
        }
        console.log("In Individual Guard, return true");
        return true;
    };
    return IndividualDetailsGuard;
}());
IndividualDetailsGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router,
        individualDetails_service_1.IndividualDetailsService])
], IndividualDetailsGuard);
exports.IndividualDetailsGuard = IndividualDetailsGuard;
//# sourceMappingURL=individualDetails-guard.service.js.map