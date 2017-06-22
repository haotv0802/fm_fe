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
var users_service_1 = require("./users.service");
var router_1 = require("@angular/router");
var modal_component_1 = require("../../common/modal/modal.component");
var usersUpdate_component_1 = require("./usersUpdate.component");
var UsersComponent = (function () {
    function UsersComponent(_usersService, _router) {
        this._usersService = _usersService;
        this._router = _router;
        this.settings = {
            columns: {
                id: {
                    title: 'ID',
                    // width: '20px',
                    filter: true
                },
                name: {
                    title: 'NAME',
                    // width: '100px',
                    editable: true,
                    filter: false
                },
                role: {
                    title: 'ROLE',
                    // width: '100px',
                    filter: true
                }
            },
            hideSubHeader: false,
            actions: {
                edit: true
            },
            delete: {
                confirmDelete: true
            },
            pager: {
                display: true,
                perPage: 3
            }
        };
        this.loaderOpen = true;
        this.pageTitle = 'User component';
    }
    UsersComponent.prototype.ngOnInit = function () {
        // let timer = Observable.interval(1000);
        // // subscribing to a observable returns a subscription object
        // timer.subscribe(
        //   () => {
        //     this.getUsers();
        //   }
        // )
        // ;
        this.getUsers();
    };
    UsersComponent.prototype.getUsers = function () {
        var _this = this;
        console.log("get users");
        this._usersService.getUsers().subscribe(function (users) {
            _this.users = users;
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    UsersComponent.prototype.editUser = function () {
        // this._router.navigate(["admin/usersUpdate"]);
        this.popupUsersUpdate();
    };
    UsersComponent.prototype.popupUsersUpdate = function () {
        this.modal.modalTitle = "User Update";
        this.modal.modalFooter = false;
        this.modal.modalMessage = true;
        this.modal.documentWidth = 800;
        // this.modal.message = "Here Users Update component will load.";
        this.modal.open(usersUpdate_component_1.UsersUpdateComponent);
    };
    return UsersComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], UsersComponent.prototype, "modal", void 0);
UsersComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'users.component.html'
        // styleUrls: ['app/products/product-list.component.css']
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        router_1.Router])
], UsersComponent);
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map