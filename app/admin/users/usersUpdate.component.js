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
var usersUpdate_service_1 = require("./usersUpdate.service");
var Rx_1 = require("rxjs/Rx");
var constant_1 = require("../../common/constant");
var router_1 = require("@angular/router");
var angular2_toaster_1 = require("angular2-toaster");
var modal_component_1 = require("../../common/modal/modal.component");
var UsersUpdateComponent = (function () {
    function UsersUpdateComponent(_userUpdateService, _constants, _router, _toasterService, _modal) {
        this._userUpdateService = _userUpdateService;
        this._constants = _constants;
        this._router = _router;
        this._toasterService = _toasterService;
        this._modal = _modal;
        this.saveDisabled = true;
        // this.pageTitle = 'User component';
        this.modal = _modal;
    }
    UsersUpdateComponent.prototype.close = function () {
        this.modal.close();
    };
    UsersUpdateComponent.prototype.ngOnInit = function () {
        var _this = this;
        Rx_1.Observable.forkJoin(this._userUpdateService.getUsers(), this._userUpdateService.getRolesInfo()).subscribe(function (data) {
            _this.users = data[0];
            _this.roles = data[1];
        }, function (error) {
            console.log(error);
        });
    };
    UsersUpdateComponent.prototype.getUsers = function () {
        var _this = this;
        this._userUpdateService.getUsers().subscribe(function (users) {
            _this.users = users;
        }, function (error) {
            console.log(error);
        });
    };
    UsersUpdateComponent.prototype.getRolesInfo = function () {
        var _this = this;
        this._userUpdateService.getRolesInfo().subscribe(function (roles) {
            _this.roles = roles;
        }, function (error) {
            console.log(error);
        });
    };
    UsersUpdateComponent.prototype.onSelectChange = function (event, userTemp) {
        this.saveDisabled = false;
        userTemp.roleId = event.target.value;
    };
    UsersUpdateComponent.prototype.save = function () {
        var _this = this;
        this._userUpdateService.updateUsersRoles(this.users).subscribe(function (res) {
            if (res.status == _this._constants.HTTP_STATUS_OK) {
                _this._toasterService.pop(_this._constants.TOASTER_SUCCESS, "Users updated successfully");
                // this._router.navigate(["admin/users"]);
                var timer = Rx_1.Observable.interval(3000);
                timer.subscribe(function () {
                    // this._router.navigate(["admin/users"]);
                    _this.close();
                });
            }
            else {
                _this._toasterService.pop(_this._constants.TOASTER_ERROR, "Users updated unsuccessfully");
            }
        }, function (error) {
            console.log(error);
        });
    };
    return UsersUpdateComponent;
}());
UsersUpdateComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'usersUpdate.component.html'
    }),
    __metadata("design:paramtypes", [usersUpdate_service_1.UsersUpdateService,
        constant_1.Constants,
        router_1.Router,
        angular2_toaster_1.ToasterService,
        modal_component_1.ModalComponent])
], UsersUpdateComponent);
exports.UsersUpdateComponent = UsersUpdateComponent;
//# sourceMappingURL=usersUpdate.component.js.map