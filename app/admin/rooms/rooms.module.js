"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var rooms_component_1 = require("./rooms.component");
var roomImages_component_1 = require("./roomImages.component");
var rooms_service_1 = require("./rooms.service");
var roomImages_service_1 = require("./roomImages.service");
var common_1 = require("@angular/common");
var roomTabs_component_1 = require("./tabs/roomTabs.component");
var htCommon_module_1 = require("../../common/htCommon.module");
var roomTabs_service_1 = require("./tabs/roomTabs.service");
var modal_component_1 = require("../../common/modal/modal.component");
var roomUpdate_component_1 = require("./tabs/roomUpdate.component");
var forms_1 = require("@angular/forms");
var roomImageUpdate_component_1 = require("./tabs/roomImageUpdate.component");
var roomUpdate_service_1 = require("./tabs/roomUpdate.service");
var RoomsModule = (function () {
    function RoomsModule() {
    }
    return RoomsModule;
}());
RoomsModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild([
                { path: 'admin/rooms', component: rooms_component_1.RoomsComponent },
                { path: 'admin/roomImages', component: roomImages_component_1.RoomImagesComponent }
            ]),
            common_1.CommonModule,
            htCommon_module_1.HTCommonModule,
            forms_1.ReactiveFormsModule // for FormBuilder, FormGroup, Form-related items...
        ],
        declarations: [
            rooms_component_1.RoomsComponent,
            roomImages_component_1.RoomImagesComponent,
            roomTabs_component_1.RoomTabsComponent,
            roomUpdate_component_1.RoomUpdateComponent,
            roomImageUpdate_component_1.RoomImageUpdateComponent
        ],
        providers: [
            rooms_service_1.RoomsService,
            roomImages_service_1.RoomImagesService,
            roomTabs_service_1.RoomTabsService,
            roomUpdate_service_1.RoomUpdateService
        ],
        entryComponents: [modal_component_1.ModalComponent, roomTabs_component_1.RoomTabsComponent]
    })
], RoomsModule);
exports.RoomsModule = RoomsModule;
//# sourceMappingURL=rooms.module.js.map