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
var http_1 = require("@angular/http");
var IndividualUpdateService = (function () {
    function IndividualUpdateService(_http, _httpService, _constants) {
        this._http = _http;
        this._httpService = _httpService;
        this._constants = _constants;
    }
    // isUserNameExisting(username: string) {
    //   return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_USERNAME_CHECK_SERVICE_URL + username)
    //     .map((res) => res.json())
    //     ;
    // }
    IndividualUpdateService.prototype.isUserNameExisting = function (oldUserName, userName) {
        var params = new http_1.URLSearchParams();
        params.set("oldUserName", oldUserName);
        params.set("userName", userName);
        return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_USERNAME_CHECK_SERVICE_URL, params)
            .map(function (res) { return res.json(); });
    };
    return IndividualUpdateService;
}());
IndividualUpdateService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        HTTP_service_1.HTTPService,
        constant_1.Constants])
], IndividualUpdateService);
exports.IndividualUpdateService = IndividualUpdateService;
//# sourceMappingURL=individualUpdate.service.js.map