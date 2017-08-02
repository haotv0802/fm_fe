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
        this.HOST = 'http://localhost:8880/fm-be/svc';
        this.LOGIN_SERVICE_URL = this.HOST + '/login';
        // Toaster types
        this.TOASTER_SUCCESS = "success";
        this.TOASTER_ERROR = "error";
        // Messages services
        this.COMMON_MESSAGES_SERVICE_URL = this.HOST + "/messages";
        // public readonly ADMIN_MESSAGES_SERVICE_URL = this.HOST + "/admin/messages";
        // public readonly CUSTOMER_MESSAGES_SERVICE_URL = this.HOST + "/customer/messages";
        // HTTP Status
        this.HTTP_STATUS_OK = 200;
        this.HTTP_STATUS_NO_CONTENT = 204;
        this.HTTP_STATUS_BAD_REQUEST = 400;
        this.HTTP_STATUS_UNAUTHORIZED = 401;
        //  Expenses
        this.EXPENSES_SERVICE_URL = this.HOST + '/expenses';
        this.EXPENSES_DETAILS_SERVICE_URL = this.HOST + '/expensesDetails';
        this.EXPENSES_PREVIOUS_SERVICE_URL = this.HOST + '/previousExpensesDetails';
        //  Event Expenses
        this.EVENT_EXPENSES_SERVICE_URL = this.HOST + '/eventExpenses';
        // Payment methods || Cards information
        this.PAYMENT_METHODS_SERVICE_URL = this.HOST + '/paymentMethods';
        // Constants
        this.X_AUTH_TOKEN_HEADER = "X-AUTH-TOKEN";
        this.AUTH_TOKEN = "AUTH_TOKEN";
        this.AUTHORITY = "AUTHORITY";
        this.AUTHORITY_ADMIN = "ADMIN";
        this.AUTHORITY_CUSTOMER = "CUSTOMER";
        // Names of Components
        this.WELCOME_URL = 'welcome';
    }
    Constants = __decorate([
        core_1.Injectable()
    ], Constants);
    return Constants;
}());
exports.Constants = Constants;
//# sourceMappingURL=constant.js.map