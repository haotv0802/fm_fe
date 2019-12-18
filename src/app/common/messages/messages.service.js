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
var constant_1 = require("../constant");
var HTTP_service_1 = require("../HTTP.service");
var MessagesService = (function () {
    function MessagesService(_constants, _httpService) {
        this._constants = _constants;
        this._httpService = _httpService;
        // console.log("messages");
        // this.getMessages().subscribe(
        //   (res) => {
        //     this.keyValuePairs = res;
        //     // console.log("key value pairs: ");
        //     // console.log(this.keyValuePairs);
        //     // console.log(this.keyValuePairs["admin.roomList.name"]);
        //   },
        //   (error: Error) => {
        //     console.log(error);
        //   }
        // );
    }
    MessagesService.prototype.getMessagesByName = function (key) {
        try {
            var result = this.messages[key];
            if (result == undefined) {
                return {};
            }
            else {
                return result;
            }
        }
        catch (err) {
            // console.log(err);
            return {};
        }
        // let result = this.keyValuePairs[key];
        // if (null == result) {
        //   return "";
        // }
        // return result;
    };
    // getAdminMessages(): void {
    //   this._httpService.get(this._constants.ADMIN_MESSAGES_SERVICE_URL)
    //     .map(
    //       (res) => {
    //         // console.log(res.json());
    //         return res.json();
    //       }
    //     )
    //     // .do(
    //     //   (data) => {
    //     //     console.log("do print json");
    //     //     console.log(JSON.stringify(data));
    //     //   }
    //     // )
    //     // .subscribe(
    //     //   (res) => {
    //     //     this.keyValuePairs = res;
    //     //   },
    //     //   (error: Error) => {
    //     //     console.log(error);
    //     //   }
    //     // )
    //     .subscribe(
    //       (res) => {
    //         this.messages = res;
    //       },
    //       (error: Error) => {
    //         console.log(error);
    //       }
    //     );
    //   ;
    // }
    MessagesService.prototype.getCommonMessagesByName = function (key) {
        try {
            var result = this.commonMessages[key];
            if (result == undefined) {
                return {};
            }
            else {
                return result;
            }
        }
        catch (err) {
            return {};
        }
    };
    MessagesService.prototype.getCommonMessages = function () {
        var _this = this;
        this._httpService.get(this._constants.COMMON_MESSAGES_SERVICE_URL)
            .map(function (res) {
            console.log("getCommonMessages: ");
            console.log(res.json());
            return res.json();
        })
            .subscribe(function (res) {
            _this.commonMessages = res;
        }, function (error) {
            console.log(error);
        });
        ;
    };
    MessagesService.prototype.getCommonMessages_ = function () {
        var _this = this;
        return this._httpService.get(this._constants.COMMON_MESSAGES_SERVICE_URL)
            .map(function (res) {
            // this.commonMessages = res.json();
            // return this.commonMessages;
            // console.log("mapping");
            return res.json();
        })
            .do(function (data) {
            // console.log("do print json");
            // console.log(JSON.stringify(data));
            _this.commonMessages = data;
        });
    };
    MessagesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [constant_1.Constants,
            HTTP_service_1.HTTPService])
    ], MessagesService);
    return MessagesService;
}());
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map