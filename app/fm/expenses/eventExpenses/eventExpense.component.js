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
var Rx_1 = require("rxjs/Rx");
var expense_1 = require("../expense");
var modal_component_1 = require("../../../common/modal/modal.component");
var expenses_service_1 = require("../expenses.service");
var eventExpense_service_1 = require("./eventExpense.service");
var EventExpenseComponent = (function () {
    function EventExpenseComponent(_expenseEventService, _expensesService, _router, fb, _route) {
        this._expenseEventService = _expenseEventService;
        this._expensesService = _expensesService;
        this._router = _router;
        this.fb = fb;
        this._route = _route;
        this.loaderOpen = true;
        this.expenseEdit = new expense_1.Expense();
        this.pageTitle = 'Expense Event';
    }
    EventExpenseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this._route.params.subscribe(function (params) {
            var expenseId = +params['expenseId'];
            console.log("expenseId: " + expenseId);
            _this._expenseEventService.getEventExpenses(expenseId).subscribe(function (event) {
                _this.event = event;
                console.log("event: ");
                console.log(_this.event);
            }, function (error) {
                console.log(error);
            });
        });
        Rx_1.Observable.forkJoin(this._expensesService.getExpensesDetails(), this._expensesService.getPaymentMethods()).subscribe(function (data) {
            _this.expensesDetails = data[0];
            _this.paymentMethods = data[1];
            _this.expensesForm = _this.fb.group({
                amount: ['', [forms_1.Validators.required]],
                date: [''],
                place: [''],
                paymentMethod: ['', [forms_1.Validators.required]],
                forPerson: ['']
            });
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    return EventExpenseComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], EventExpenseComponent.prototype, "modal", void 0);
EventExpenseComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'eventExpense.component.html'
    }),
    __metadata("design:paramtypes", [eventExpense_service_1.EventExpenseService,
        expenses_service_1.ExpensesService,
        router_1.Router,
        forms_1.FormBuilder,
        router_1.ActivatedRoute])
], EventExpenseComponent);
exports.EventExpenseComponent = EventExpenseComponent;
//# sourceMappingURL=eventExpense.component.js.map