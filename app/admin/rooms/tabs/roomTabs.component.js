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
var roomTabs_service_1 = require("./roomTabs.service");
var modal_component_1 = require("../../../common/modal/modal.component");
var RoomTabsComponent = (function () {
    function RoomTabsComponent(_roomTabsService, _router, _modal) {
        this._roomTabsService = _roomTabsService;
        this._router = _router;
        this._modal = _modal;
        this.isActive = true;
        this.pageTitle = 'Room Tabs';
    }
    RoomTabsComponent.prototype.ngOnInit = function () {
    };
    RoomTabsComponent.prototype.close = function () {
        this._modal.close();
    };
    RoomTabsComponent.prototype.displayEdit = function () {
        this.isActive = true;
        return false;
    };
    RoomTabsComponent.prototype.displayImageUpdate = function () {
        this.isActive = false;
        return false;
    };
    return RoomTabsComponent;
}());
RoomTabsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'roomTabs.component.html'
    }),
    __metadata("design:paramtypes", [roomTabs_service_1.RoomTabsService,
        router_1.Router,
        modal_component_1.ModalComponent])
], RoomTabsComponent);
exports.RoomTabsComponent = RoomTabsComponent;
//# sourceMappingURL=roomTabs.component.js.map