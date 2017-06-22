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
var forms_1 = require("@angular/forms");
require("rxjs/add/operator/debounceTime");
var roomUpdate_service_1 = require("./roomUpdate.service");
var modal_component_1 = require("../../../common/modal/modal.component");
var angular2_toaster_1 = require("angular2-toaster");
var constant_1 = require("../../../common/constant");
var RoomUpdateComponent = (function () {
    function RoomUpdateComponent(_router, fb, _modal, _roomUpdateService, _toasterService, _constants) {
        this._router = _router;
        this.fb = fb;
        this._modal = _modal;
        this._roomUpdateService = _roomUpdateService;
        this._toasterService = _toasterService;
        this._constants = _constants;
        this.loaderOpen = false;
        this.pageTitle = 'Individual Update';
    }
    RoomUpdateComponent.prototype.ngOnInit = function () {
        this.roomType = this._roomUpdateService.roomType;
        // console.log(this.roomType);
        this.roomForm = this.fb.group({
            roomName: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            numOfPeople: ['', [forms_1.Validators.required]],
            numOfBeds: ['', [forms_1.Validators.required]],
            typeOfBeds: ['', [forms_1.Validators.required]]
        });
        this.populateData();
    };
    RoomUpdateComponent.prototype.ngOnDestroy = function () {
    };
    RoomUpdateComponent.prototype.save = function () {
        var _this = this;
        this.loaderOpen = true;
        setTimeout(function () { _this.updateRoomType(); }, 1000);
        // this.updateRoomType();
    };
    RoomUpdateComponent.prototype.populateData = function () {
        this.roomForm.patchValue({
            roomName: this.roomType.name,
            numOfPeople: this.roomType.numOfPeople,
            numOfBeds: this.roomType.numOfBeds,
            typeOfBeds: this.roomType.typeOfBed
        });
    };
    RoomUpdateComponent.prototype.counter = function (length) {
        return new Array(length);
    };
    RoomUpdateComponent.prototype.updateRoomType = function () {
        var _this = this;
        this.roomType.name = this.roomForm.get("roomName").value;
        this.roomType.numOfBeds = parseInt(this.roomForm.get("numOfBeds").value);
        this.roomType.numOfPeople = parseInt(this.roomForm.get("numOfPeople").value);
        this.roomType.typeOfBed = this.roomForm.get("typeOfBeds").value;
        this._roomUpdateService.updateRoomType(this.roomType).subscribe(function (response) {
            _this._toasterService.pop(_this._constants.TOASTER_SUCCESS, "Room updated successfully");
            _this._modal.close("data changed");
            _this.loaderOpen = false;
        }, function (error) {
            console.log("Error happens at roomUpdate");
            console.log(error);
        });
    };
    return RoomUpdateComponent;
}());
RoomUpdateComponent = __decorate([
    core_1.Component({
        selector: 'room-update',
        moduleId: module.id,
        templateUrl: 'roomUpdate.component.html'
    }),
    __metadata("design:paramtypes", [router_1.Router,
        forms_1.FormBuilder,
        modal_component_1.ModalComponent,
        roomUpdate_service_1.RoomUpdateService,
        angular2_toaster_1.ToasterService,
        constant_1.Constants])
], RoomUpdateComponent);
exports.RoomUpdateComponent = RoomUpdateComponent;
//# sourceMappingURL=roomUpdate.component.js.map