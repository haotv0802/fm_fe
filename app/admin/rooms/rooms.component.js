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
var rooms_service_1 = require("./rooms.service");
var roomImages_service_1 = require("./roomImages.service");
var router_1 = require("@angular/router");
var modal_component_1 = require("../../common/modal/modal.component");
var roomTabs_component_1 = require("./tabs/roomTabs.component");
var roomUpdate_service_1 = require("./tabs/roomUpdate.service");
var messages_service_1 = require("../../common/messages/messages.service");
var RoomsComponent = (function () {
    function RoomsComponent(_messagesService, _roomService, _roomImagesService, _router, _roomUpdateService) {
        this._messagesService = _messagesService;
        this._roomService = _roomService;
        this._roomImagesService = _roomImagesService;
        this._router = _router;
        this._roomUpdateService = _roomUpdateService;
        this.ready = false;
        this.pageTitle = 'Room Management';
        // this.getRoomTypes();
        this.messages = this._messagesService.getMessagesByName("roomsList");
    }
    RoomsComponent.prototype.ngOnInit = function () {
        // let timer = Observable.interval(1000);
        // this.sub = timer.subscribe(
        //   () => {
        //     this.getRoomTypes();
        //   }
        // )
        // ;
        this.getRoomTypes();
        if (this.messages != null) {
            this.ready = true;
        }
    };
    RoomsComponent.prototype.ngOnDestroy = function () {
        // this.sub.unsubscribe();
    };
    RoomsComponent.prototype.getRoomTypes = function () {
        var _this = this;
        this._roomService.getRoomTypes().subscribe(function (roomTypes) {
            _this.roomTypes = roomTypes;
        }, function (error) {
            console.log(error);
        });
    };
    RoomsComponent.prototype.displayImages = function (images) {
        this._roomImagesService.images = images;
        this._router.navigate(['admin/roomImages']);
        return false;
    };
    RoomsComponent.prototype.editRoom = function (roomType) {
        // this.modal.modalTitle = "Room Tabs";
        this.modal.modalHeader = false;
        this.modal.modalFooter = false;
        this.modal.modalMessage = true;
        this.modal.documentWidth = 700;
        // this.modal.message = "Here Users Update component will load.";
        this.modal.open(roomTabs_component_1.RoomTabsComponent);
        this._roomUpdateService.roomType = roomType;
    };
    RoomsComponent.prototype.counter = function (length) {
        return new Array(length);
    };
    RoomsComponent.prototype.syncData = function (data) {
        // Observable.forkJoin(
        //   this._roomUpdateService.updateRoomType(data),
        //   this._roomService.getRoomTypes()
        // ).subscribe(
        //   (data) => {
        //     console.log(data[0]);
        //     this.roomTypes = data[1];
        //   },
        //   (error) => {
        //     console.log(error);
        //   }
        // )
        // ;
        // console.log(event);
        // this.getRoomTypes();
    };
    return RoomsComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], RoomsComponent.prototype, "modal", void 0);
RoomsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'rooms.component.html'
        // templateUrl: 'app/admin/rooms/rooms.component.html'
        // styleUrls: ['app/products/product-list.component.css']
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        rooms_service_1.RoomsService,
        roomImages_service_1.RoomImagesService,
        router_1.Router,
        roomUpdate_service_1.RoomUpdateService])
], RoomsComponent);
exports.RoomsComponent = RoomsComponent;
//# sourceMappingURL=rooms.component.js.map