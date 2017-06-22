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
var constant_1 = require("../../common/constant");
var HTTP_service_1 = require("../../common/HTTP.service");
var UsersService = (function () {
    function UsersService(_httpService, _constants) {
        this._httpService = _httpService;
        this._constants = _constants;
    }
    UsersService.prototype.getUsers = function () {
        // let headers = new Headers();
        //
        // headers.append("Accept-Language", "en");
        // headers.append("Content-Type", "application/json");
        // headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
        //
        // return this._http.get(this._constants.ADMIN_USERS_SERVICE_URL, {headers: headers})
        //   .map((res) => { return <User[]> res.json(); })
        //   .catch(this.handleError)
        // ;
        return this._httpService.get(this._constants.ADMIN_USERS_SERVICE_URL)
            .map(function (res) { return res.json(); });
    };
    return UsersService;
}());
UsersService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [HTTP_service_1.HTTPService,
        constant_1.Constants])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map