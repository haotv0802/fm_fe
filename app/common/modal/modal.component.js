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
// import 'reflect-metadata';
var core_1 = require("@angular/core");
var ModalComponent = (function () {
    function ModalComponent(compiler, viewContainer) {
        this.compiler = compiler;
        this.viewContainer = viewContainer;
        /**
         * Describes if the modal contains Ok Button.
         * The default Ok button will close the modal and emit the callback.
         * Defaults to true.
         */
        this.okButton = true;
        /**
         * Caption for the OK button.
         * Default: Ok
         */
        this.okButtonText = 'Ok';
        /**
         * Describes if the modal contains cancel Button.
         * The default Cancelbutton will close the modal.
         * Defaults to true.
         */
        this.cancelButton = true;
        /**
         * Caption for the Cancel button.
         * Default: Cancel
         */
        this.cancelButtonText = 'Cancel';
        /**
         * if the modalMessage is true it will show the message inside modal body.
         */
        this.modalMessage = true;
        /**
         * if the value is true modal footer will be visible or else it will be hidden.
         */
        this.modalFooter = true;
        /**
         * shows modal header if the value is true.
         */
        this.modalHeader = true;
        /**
         * if the value is true modal will be visible or else it will be hidden.
         */
        this.isOpen = false;
        /**
         * Width of document.
         * @type {number}
         */
        this.documentWidth = 500;
        this.modalOutput = new core_1.EventEmitter();
    }
    /**
     * Opens a modal window creating backdrop.
     * @param component The angular Component that is to be loaded dynamically(optional).
     */
    ModalComponent.prototype.open = function (component) {
        this.isOpen = true;
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
        if (component) {
            var componentFactory = this.compiler.resolveComponentFactory(component);
            this.cmpRef = this.target.createComponent(componentFactory);
        }
    };
    /**
     *  close method dispose the component, closes the modal and optionally emits modalOutput value.
     */
    ModalComponent.prototype.close = function (data) {
        this.dispose();
        if (data) {
            this.modalOutput.emit(data);
        }
    };
    /**
     *  ok method dispose the component, closes the modal and emits true.
     */
    ModalComponent.prototype.submit = function () {
        this.dispose();
        this.modalOutput.emit(true);
    };
    /**
     *  dispose method dispose the loaded component.
     */
    ModalComponent.prototype.dispose = function () {
        this.isOpen = false;
        if (this.component != undefined) {
            this.component.then(function (componentRef) {
                componentRef.destroy();
                return componentRef;
            });
        }
    };
    __decorate([
        core_1.ViewChild("child", { read: core_1.ViewContainerRef }),
        __metadata("design:type", Object)
    ], ModalComponent.prototype, "target", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ModalComponent.prototype, "modalOutput", void 0);
    ModalComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'modal',
            templateUrl: 'modal.component.html',
            providers: [],
            encapsulation: core_1.ViewEncapsulation.None
        })
        /**
         * API to an open modal window.
         */
        ,
        __metadata("design:paramtypes", [core_1.ComponentFactoryResolver, core_1.ViewContainerRef])
    ], ModalComponent);
    return ModalComponent;
}());
exports.ModalComponent = ModalComponent;
//# sourceMappingURL=modal.component.js.map