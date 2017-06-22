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
var modal_component_1 = require("../../../common/modal/modal.component");
var Login = (function () {
    function Login(_modal) {
        this._modal = _modal;
        this.modal = _modal;
    }
    Login.prototype.close = function () {
        this.modal.close();
    };
    Login.prototype.login = function (username, password) {
        var data = { username: username, pasword: password };
        this.modal.close(data);
    };
    return Login;
}());
Login = __decorate([
    core_1.Component({
        selector: 'login',
        moduleId: module.id,
        templateUrl: 'login.html',
        styleUrls: ['login.css'],
    }),
    __metadata("design:paramtypes", [modal_component_1.ModalComponent])
], Login);
exports.Login = Login;
//# sourceMappingURL=login.js.map