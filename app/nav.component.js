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
var constant_1 = require("./common/constant");
var NavComponent = (function () {
    // public authority: string;
    function NavComponent(_router, _constants) {
        this._router = _router;
        this._constants = _constants;
        // this.authority = sessionStorage.getItem("authority");
        // console.log("Authority: " + this.authority);
    }
    NavComponent.prototype.authority = function () {
        // console.log("nav - get session storage: " + sessionStorage.getItem("authority"));
        return sessionStorage.getItem(this._constants.AUTHORITY);
    };
    NavComponent.prototype.logout = function () {
        sessionStorage.setItem(this._constants.AUTHORITY, null);
        sessionStorage.setItem(this._constants.AUTH_TOKEN, null);
        this._router.navigate(["welcome"]);
        return false;
    };
    NavComponent = __decorate([
        core_1.Component({
            selector: 'ht-nav',
            moduleId: module.id,
            templateUrl: 'nav.component.html',
            styleUrls: ['nav.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router, constant_1.Constants])
    ], NavComponent);
    return NavComponent;
}());
exports.NavComponent = NavComponent;
//# sourceMappingURL=nav.component.js.map