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
var http_1 = require("@angular/http");
var constant_1 = require("./../constant");
var HTTP_service_1 = require("../HTTP.service");
var LoginService = (function () {
    function LoginService(_constants, _httpService) {
        this._constants = _constants;
        this._httpService = _httpService;
    }
    LoginService.prototype.login = function (credential) {
        var headers = new http_1.Headers();
        headers.append("Accept-Language", "en");
        headers.append("Content-Type", "application/json");
        return this._httpService.post(this._constants.LOGIN_SERVICE_URL, JSON.stringify({ "userName": credential.user, "userPass": credential.pass }));
        // return this._http.post(this._constants.LOGIN_SERVICE_URL,
        //   JSON.stringify({"userName": credential.user, "userPass": credential.pass}), {
        //     headers: headers
        //   })
        // // .do(data => {console.log("All: login: "); console.log(data)})
        //   .catch(this.handleError);
    };
    LoginService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [constant_1.Constants,
            HTTP_service_1.HTTPService])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map