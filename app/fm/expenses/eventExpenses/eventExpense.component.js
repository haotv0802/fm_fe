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
var modal_component_1 = require("../../../common/modal/modal.component");
var expenses_service_1 = require("../expenses.service");
var eventExpense_service_1 = require("./eventExpense.service");
var eventExpense_1 = require("./eventExpense");
var EventExpenseComponent = (function () {
    function EventExpenseComponent(_expenseEventService, _expensesService, _router, fb, _route) {
        this._expenseEventService = _expenseEventService;
        this._expensesService = _expensesService;
        this._router = _router;
        this.fb = fb;
        this._route = _route;
        this.loaderOpen = true;
        this.expenseEdit = new eventExpense_1.EventExpense();
        this.pageTitle = 'Expense Event';
    }
    EventExpenseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this._route.params.subscribe(function (params) {
            _this.expenseId = +params['expenseId'];
            if (_this.expenseId > 0) {
                _this._expenseEventService.getEventExpenses(_this.expenseId).subscribe(function (event) {
                    _this.event = event;
                }, function (error) {
                    console.log(error);
                });
            }
        });
        Rx_1.Observable.forkJoin(this._expensesService.getPaymentMethods()).subscribe(function (data) {
            _this.paymentMethods = data[0];
            _this.expenseForm = _this.fb.group({
                amount: ['', [forms_1.Validators.required]],
                date: [''],
                place: [''],
                paymentMethod: ['', [forms_1.Validators.required]],
                forPerson: [''],
                amount_edit: ['', [forms_1.Validators.required]],
                date_edit: [''],
                place_edit: [''],
                paymentMethod_edit: ['', [forms_1.Validators.required]],
                forPerson_edit: ['']
            });
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    EventExpenseComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    EventExpenseComponent.prototype.updateTotalAmount = function (expenseId, amount) {
        var totalAmount = 0;
        for (var i = 0; i < this.event.expenses.length; i++) {
            if (this.event.expenses[i].id == expenseId) {
                totalAmount += amount;
            }
            else {
                totalAmount += this.event.expenses[i].amount;
            }
        }
        this._expensesService.updateExpenseAmount(this.event.id, totalAmount).subscribe(function (res) {
        }, function (error) {
            console.log(error);
        });
    };
    EventExpenseComponent.prototype.addAmount = function (amount) {
        var totalAmount = this.event.total + amount;
        this._expensesService.updateExpenseAmount(this.event.id, totalAmount).subscribe(function (res) {
        }, function (error) {
            console.log(error);
        });
    };
    EventExpenseComponent.prototype.addExpense = function () {
        var _this = this;
        this.expenseEdit.amount = this.expenseForm.get("amount").value;
        this.expenseEdit.date = this.expenseForm.get("date").value;
        this.expenseEdit.place = this.expenseForm.get("place").value;
        // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
        this.expenseEdit.forPerson = this.expenseForm.get("forPerson").value;
        this.expenseEdit.cardId = this.expenseForm.get("paymentMethod").value;
        if (this.expenseId == -1) {
            this._expensesService.addExpense(this._expenseEventService.expenseCreation).subscribe(function (res) {
                _this.expenseId = res.expenseId;
                _this._addExpense();
            });
        }
        else {
            this._addExpense();
        }
    };
    EventExpenseComponent.prototype._addExpense = function () {
        var _this = this;
        this._expenseEventService.addExpense(this.expenseEdit, this.expenseId).subscribe(function (res) {
            _this._expenseEventService.getEventExpenses(_this.expenseId).subscribe(function (event) {
                _this.event = event;
                _this.resetFormValues();
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    EventExpenseComponent.prototype.deleteExpense = function (expenseId, eventExpenseId) {
        var _this = this;
        this._expenseEventService.deleteExpense(expenseId, eventExpenseId).subscribe(function (res) {
            _this._expenseEventService.getEventExpenses(_this.expenseId).subscribe(function (res) {
                _this.event = res;
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    EventExpenseComponent.prototype.updateExpense = function (expenseId) {
        var _this = this;
        this.expenseEdit.amount = this.expenseForm.get("amount_edit").value;
        this.expenseEdit.date = this.expenseForm.get("date_edit").value;
        this.expenseEdit.place = this.expenseForm.get("place_edit").value;
        this.expenseEdit.forPerson = this.expenseForm.get("forPerson_edit").value;
        this.expenseEdit.cardId = this.expenseForm.get("paymentMethod_edit").value;
        this.expenseEdit.id = expenseId > 0 ? expenseId : expenseId * -1;
        this._expenseEventService.updateExpense(this.expenseEdit, this.event.id).subscribe(function (res) {
            _this._expenseEventService.getEventExpenses(_this.expenseId).subscribe(function (event) {
                _this.event = event;
                _this.resetFormValues();
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    EventExpenseComponent.prototype.closeUpdateExpense = function (expense) {
        expense.id = expense.id * -1;
        this.idUpdate = this.idUpdate * -1;
    };
    EventExpenseComponent.prototype.openUpdateExpense = function (expense) {
        var _this = this;
        if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
            var exp = this.event.expenses.find(function (x) { return x.id == _this.idUpdate; });
            exp.id = exp.id * -1;
        }
        if (this.idUpdate && this.idUpdate == expense.id) {
            return;
        }
        expense.id = expense.id * -1;
        this.idUpdate = expense.id;
        this.expenseForm.get("amount_edit").setValue(expense.amount);
        this.expenseForm.get("date_edit").setValue(expense.date);
        this.expenseForm.get("place_edit").setValue(expense.place);
        this.expenseForm.get("forPerson_edit").setValue(expense.forPerson);
        this.expenseForm.get("paymentMethod_edit").setValue(expense.cardId);
    };
    EventExpenseComponent.prototype.openOrCloseUpdateExpense = function (expense) {
        var _this = this;
        // console.log(event);
        if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
            var exp = this.event.expenses.find(function (x) { return x.id == _this.idUpdate; });
            exp.id = exp.id * -1;
        }
        expense.id = expense.id * -1;
        this.idUpdate = expense.id;
        this.expenseForm.get("amount_edit").setValue(expense.amount);
        this.expenseForm.get("date_edit").setValue(expense.date);
        this.expenseForm.get("place_edit").setValue(expense.place);
        this.expenseForm.get("forPerson_edit").setValue(expense.forPerson);
        this.expenseForm.get("paymentMethod_edit").setValue(expense.cardId);
    };
    EventExpenseComponent.prototype.resetFormValues = function () {
        this.expenseForm.setValue({
            amount: '',
            date: '',
            place: '',
            paymentMethod: '',
            forPerson: '',
            amount_edit: '',
            date_edit: '',
            place_edit: '',
            paymentMethod_edit: '',
            forPerson_edit: ''
        });
        this.idUpdate = undefined;
    };
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
    return EventExpenseComponent;
}());
exports.EventExpenseComponent = EventExpenseComponent;
//# sourceMappingURL=eventExpense.component.js.map