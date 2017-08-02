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
///<reference path="../../node_modules/@angular/http/src/http.d.ts"/>
var core_1 = require("@angular/core");
var constant_1 = require("./constant");
var Observable_1 = require("rxjs/Observable");
var http_1 = require("@angular/http");
var HTTPService = (function () {
    function HTTPService(_http, _constants) {
        this._http = _http;
        this._constants = _constants;
    }
    HTTPService.prototype.post = function (url, data) {
        var headers = new http_1.Headers();
        headers.append("Accept-Language", this.getAcceptLanguage());
        headers.append("Content-Type", "application/json");
        if (url != this._constants.LOGIN_SERVICE_URL) {
            headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
        }
        return this._http.post(url, data, { headers: headers });
    };
    HTTPService.prototype.patch = function (url, data) {
        var headers = new http_1.Headers();
        headers.append("Accept-Language", this.getAcceptLanguage());
        headers.append("Content-Type", "application/json");
        if (url != this._constants.LOGIN_SERVICE_URL) {
            headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
        }
        return this._http.patch(url, data, { headers: headers });
    };
    HTTPService.prototype.delete = function (url) {
        var headers = new http_1.Headers();
        headers.append("Accept-Language", this.getAcceptLanguage());
        headers.append("Content-Type", "application/json");
        if (url != this._constants.LOGIN_SERVICE_URL) {
            headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
        }
        return this._http.delete(url, { headers: headers });
    };
    HTTPService.prototype.postImageFile = function (url, data) {
        var headers = new http_1.Headers();
        headers.append("Accept-Language", this.getAcceptLanguage());
        // headers.append("Content-Type", "multipart/form-data");
        headers.append('Accept', 'application/json');
        if (url != this._constants.LOGIN_SERVICE_URL) {
            headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
        }
        return this._http.post(url, data, { headers: headers });
    };
    HTTPService.prototype.get = function (url, params) {
        var headers = new http_1.Headers();
        headers.append("Accept-Language", this.getAcceptLanguage());
        headers.append("Content-Type", "application/json");
        if (url != this._constants.LOGIN_SERVICE_URL) {
            headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
        }
        var requestOptions = new http_1.RequestOptions();
        requestOptions.headers = headers;
        requestOptions.params = params;
        return this._http.get(url, requestOptions)
            .catch(this.handleError);
    };
    HTTPService.prototype.handleError = function (error) {
        console.error("Error logged in HTTPService: ");
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    HTTPService.prototype.getAcceptLanguage = function () {
        // console.log("language: ");
        // console.log(navigator.language);
        //
        // let strings: string[] = navigator.language.split('-');
        // if (strings.length == 2) {
        //   console.log("Accept Language: " + strings[0]);
        //   return strings[0];
        // } else if (strings.length == 1) {
        //   return strings[0];
        // }
        // else {
        //   return "";
        // }
        // console.log("this._constants.LANGUAGE: " + this._constants.LANGUAGE);
        return this._constants.LANGUAGE;
    };
    HTTPService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            constant_1.Constants])
    ], HTTPService);
    return HTTPService;
}());
exports.HTTPService = HTTPService;
//# sourceMappingURL=HTTP.service.js.map