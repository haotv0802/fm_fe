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
var individualDetails_service_1 = require("./individualDetails.service");
var router_1 = require("@angular/router");
var individualUpdate_service_1 = require("./individualUpdate.service");
var IndividualDetailsComponent = (function () {
    function IndividualDetailsComponent(_individualDetailsService, _individualUpdateService, _router) {
        this._individualDetailsService = _individualDetailsService;
        this._individualUpdateService = _individualUpdateService;
        this._router = _router;
        this.pageTitle = 'Individual Details';
    }
    IndividualDetailsComponent.prototype.ngOnInit = function () {
        this.individual = this._individualDetailsService.individual;
    };
    IndividualDetailsComponent.prototype.backIndividualList = function () {
        this._router.navigate(["admin/individuals"]);
    };
    IndividualDetailsComponent.prototype.editIndividual = function () {
        this._individualUpdateService.individual = this.individual;
        this._router.navigate(["admin/individuals/update"]);
    };
    return IndividualDetailsComponent;
}());
IndividualDetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'individualDetails.component.html',
        styleUrls: ['individualDetails.component.css']
    }),
    __metadata("design:paramtypes", [individualDetails_service_1.IndividualDetailsService,
        individualUpdate_service_1.IndividualUpdateService,
        router_1.Router])
], IndividualDetailsComponent);
exports.IndividualDetailsComponent = IndividualDetailsComponent;
//# sourceMappingURL=individualDetails.component.js.map