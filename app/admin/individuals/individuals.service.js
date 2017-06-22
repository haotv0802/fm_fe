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
var IndividualsService = (function () {
    function IndividualsService(_httpService, _constants) {
        this._httpService = _httpService;
        this._constants = _constants;
    }
    IndividualsService.prototype.getIndividuals = function () {
        return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_SERVICE_URL)
            .map(function (res) { return res.json(); });
    };
    IndividualsService.prototype.getIndividualsWithPaging = function (pageNum) {
        var params = new http_1.URLSearchParams();
        params.set("page", pageNum.toString());
        params.set("size", "5");
        return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_WITH_PAGING_SERVICE_URL, params)
            .map(function (res) { return res.json(); });
    };
    IndividualsService.prototype.getIndividualsCount = function () {
        return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_COUNT_SERVICE_URL)
            .map(function (res) { return res.json().individualsCount; });
    };
    return IndividualsService;
}());
IndividualsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [HTTP_service_1.HTTPService,
        constant_1.Constants])
], IndividualsService);
exports.IndividualsService = IndividualsService;
//# sourceMappingURL=individuals.service.js.map