"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants = (function () {
    function Constants() {
        this.LANGUAGE = "en";
        this.HOST = 'http://localhost:8880/ht-be/svc';
        this.LOGIN_SERVICE_URL = this.HOST + '/login';
        // Toaster types
        this.TOASTER_SUCCESS = "success";
        this.TOASTER_ERROR = "error";
        // Messages services
        this.COMMON_MESSAGES_SERVICE_URL = this.HOST + "/messages";
        this.ADMIN_MESSAGES_SERVICE_URL = this.HOST + "/admin/messages";
        this.CUSTOMER_MESSAGES_SERVICE_URL = this.HOST + "/customer/messages";
        // HTTP Status
        this.HTTP_STATUS_OK = 200;
        this.HTTP_STATUS_NO_CONTENT = 204;
        this.HTTP_STATUS_BAD_REQUEST = 400;
        this.HTTP_STATUS_UNAUTHORIZED = 401;
        ////      Services URLs for Admin
        //  Users (for Admin)
        this.ADMIN_USERS_SERVICE_URL = this.HOST + '/admin/users';
        this.ADMIN_USERS_ROLES_UPDATE_SERVICE_URL = this.HOST + '/admin/users/usersRolesUpdate';
        //  Roles (for Admin)
        this.ADMIN_ROLES_SERVICE_URL = this.HOST + '/admin/roles';
        this.ADMIN_ROLES_KEYVALUE_SERVICE_URL = this.HOST + '/admin/roles/keyValuePair';
        //  Rooms
        this.ADMIN_ROOMS_ROOM_TYPES_SERVICE_URL = this.HOST + '/admin/rooms/roomTypes';
        this.ADMIN_ROOMS_ROOM_TYPE_UPDATE_SERVICE_URL = this.HOST + '/admin/rooms/roomTypes/update';
        //  Images (for Admin)
        this.ADMIN_IMAGES_SERVICE_URL = this.HOST + '/admin/images';
        this.ADMIN_IMAGE_UPDATE_SERVICE_URL = this.HOST + "/admin/images/updateImageInfo";
        //  Individuals (for Admin)
        this.ADMIN_INDIVIDUALS_SERVICE_URL = this.HOST + '/admin/individuals';
        this.ADMIN_INDIVIDUALS_WITH_PAGING_SERVICE_URL = this.HOST + '/admin/individuals/paging';
        this.ADMIN_INDIVIDUALS_COUNT_SERVICE_URL = this.HOST + '/admin/individuals/count';
        this.ADMIN_INDIVIDUALS_USERNAME_CHECK_SERVICE_URL = this.HOST + '/admin/individuals/isUserNameExisting';
        // Services URLs for Staff
        // Services URLs for Customer
        // Constants
        this.X_AUTH_TOKEN_HEADER = "X-AUTH-TOKEN";
        this.AUTH_TOKEN = "AUTH_TOKEN";
        this.AUTHORITY = "AUTHORITY";
        this.AUTHORITY_ADMIN = "ADMIN";
        this.AUTHORITY_CUSTOMER = "CUSTOMER";
        // Names of Components
        this.WELCOME_URL = 'welcome';
    }
    return Constants;
}());
Constants = __decorate([
    core_1.Injectable()
], Constants);
exports.Constants = Constants;
//# sourceMappingURL=constant.js.map