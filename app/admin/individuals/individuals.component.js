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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var individuals_service_1 = require("./individuals.service");
var individualDetails_service_1 = require("./individualDetails.service");
var router_1 = require("@angular/router");
var individualUpdate_service_1 = require("./individualUpdate.service");
var pagination_1 = require("../../common/pagination");
var Rx_1 = require("rxjs/Rx");
var platform_browser_1 = require("@angular/platform-browser");
var angular2_modal_1 = require("angular2-modal");
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var messages_service_1 = require("../../common/messages/messages.service");
var IndividualsComponent = (function () {
    function IndividualsComponent(_messagesService, _individualService, _individualDetailsService, _individualUpdateService, _router, overlay, vcRef, modal, document) {
        this._messagesService = _messagesService;
        this._individualService = _individualService;
        this._individualDetailsService = _individualDetailsService;
        this._individualUpdateService = _individualUpdateService;
        this._router = _router;
        this.modal = modal;
        this.document = document;
        this.isOpen = true;
        this.pageTitle = 'Individual List';
        overlay.defaultViewContainer = vcRef;
    }
    IndividualsComponent.prototype.onClick = function () {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .title('A simple Alert style modal window')
            .body("\n            <h4>Alert is a classic (title/body/footer) 1 button modal window that \n            does not block.</h4>\n            <b>Configuration:</b>\n            <ul>\n                <li>Non blocking (click anywhere outside to dismiss)</li>\n                <li>Size large</li>\n                <li>Dismissed with default keyboard key (ESC)</li>\n                <li>Close wth button click</li>\n                <li>HTML content</li>\n            </ul>\n        ")
            .open();
    };
    IndividualsComponent.prototype.ngOnInit = function () {
        this.getIndividuals(0);
        this.getAllIndividuals();
    };
    IndividualsComponent.prototype.getAllIndividuals = function () {
        var _this = this;
        // let timer = Observable.interval(1000);
        // // subscribing to a observable returns a subscription object
        // timer.subscribe(
        //   () => {
        //     this._individualService.getIndividuals().subscribe(
        //       (individuals) => {
        //         this.individualsALL = individuals;
        //         this.isOpen = false;
        //       },
        //       (error) => {
        //         console.log(error);
        //       }
        //     );
        //   }
        // );
        this._individualService.getIndividuals().subscribe(function (individuals) {
            _this.individualsALL = individuals;
            _this.isOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    // @HostListener("window:scroll", [])
    // onWindowScroll() {
    //   let number = this.document.body.scrollTop;
    //   console.log("number: " + number);
    // }
    IndividualsComponent.prototype.getIndividuals = function (pageNum) {
        var _this = this;
        Rx_1.Observable.forkJoin(this._individualService.getIndividualsCount(), this._individualService.getIndividualsWithPaging(pageNum)).subscribe(function (data) {
            _this.individualsCount = data[0];
            _this.individuals = data[1].content;
            _this.pagination = new pagination_1.Pagination(data[1], _this.individualsCount);
        }, function (error) {
            console.log(error);
        });
        return false;
    };
    IndividualsComponent.prototype.displayIndividual = function (individual) {
        this._individualDetailsService.individual = individual;
        this._router.navigate(["admin/individuals/details"]);
    };
    IndividualsComponent.prototype.editIndividual = function (individual) {
        this._individualUpdateService.individual = individual;
        this._router.navigate(["admin/individuals/update"]);
    };
    IndividualsComponent.prototype.addIndividual = function () {
        this._router.navigate(["admin/individuals/add"]);
        return false;
    };
    IndividualsComponent.prototype.counter = function (length) {
        return new Array(length);
    };
    // @HostListener('scroll', ['$event'])
    // onScroll(event: any) {
    //   console.log(event);
    // }
    IndividualsComponent.prototype.onLoaderClicked = function (message) {
        this.pageTitle = '--->' + message;
    };
    return IndividualsComponent;
}());
IndividualsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'individuals.component.html',
        styleUrls: ['individual.bubbling.component.css']
    }),
    __param(8, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        individuals_service_1.IndividualsService,
        individualDetails_service_1.IndividualDetailsService,
        individualUpdate_service_1.IndividualUpdateService,
        router_1.Router,
        angular2_modal_1.Overlay, core_1.ViewContainerRef, bootstrap_1.Modal,
        Document])
], IndividualsComponent);
exports.IndividualsComponent = IndividualsComponent;
//# sourceMappingURL=individuals.component.js.map