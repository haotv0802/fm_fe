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
var HTTP_service_1 = require("../../../common/HTTP.service");
var constant_1 = require("../../../common/constant");
var RoomUpdateService = (function () {
    function RoomUpdateService(_httpService, _constants) {
        this._httpService = _httpService;
        this._constants = _constants;
    }
    RoomUpdateService.prototype.updateRoomType = function (roomType) {
        return this._httpService.patch(this._constants.ADMIN_ROOMS_ROOM_TYPE_UPDATE_SERVICE_URL, roomType);
    };
    return RoomUpdateService;
}());
RoomUpdateService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [HTTP_service_1.HTTPService,
        constant_1.Constants])
], RoomUpdateService);
exports.RoomUpdateService = RoomUpdateService;
//# sourceMappingURL=roomUpdate.service.js.map