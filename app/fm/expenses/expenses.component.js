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
var modal_component_1 = require("../../common/modal/modal.component");
var expense_1 = require("./expense");
var expenses_service_1 = require("./expenses.service");
var forms_1 = require("@angular/forms");
var Rx_1 = require("rxjs/Rx");
var eventExpense_service_1 = require("./eventExpenses/eventExpense.service");
var ExpensesComponent = (function () {
    function ExpensesComponent(_expensesService, _eventExpenseService, _router, fb) {
        this._expensesService = _expensesService;
        this._eventExpenseService = _eventExpenseService;
        this._router = _router;
        this.fb = fb;
        this.loaderOpen = true;
        // editHidden: boolean = false;
        this.expenseEdit = new expense_1.Expense();
        this.myOptions = {
            // other options...
            dateFormat: 'dd-mm-yyyy',
        };
        this.model = { date: { year: 2018, month: 10, day: 9 } };
        this.pageTitle = 'Expenses';
    }
    ExpensesComponent.prototype.onDateChanged = function (event) {
        // date selected
    };
    ExpensesComponent.prototype.ngOnInit = function () {
        var _this = this;
        Rx_1.Observable.forkJoin(this._expensesService.getExpenses(), this._expensesService.getPaymentMethods()).subscribe(function (data) {
            _this.expensesDetails = data[0];
            _this.paymentMethods = data[1];
            _this.expenseForm = _this.fb.group({
                amount: ['', [forms_1.Validators.required]],
                date: [new Date()],
                place: [''],
                paymentMethod: ['', [forms_1.Validators.required]],
                forPerson: [''],
                amount_edit: ['', [forms_1.Validators.required]],
                date_edit: [''],
                place_edit: [''],
                paymentMethod_edit: ['', [forms_1.Validators.required]],
                forPerson_edit: [''],
                anEvent_edit: ['']
            });
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.deleteExpense = function (expenseId) {
        var _this = this;
        this._expensesService.deleteExpense(expenseId).subscribe(function (res) {
            _this._expensesService.getExpenses().subscribe(function (expensesDetails) {
                _this.expensesDetails = expensesDetails;
                _this.resetFormValues();
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.getPaymentMethods = function () {
        var _this = this;
        this._expensesService.getPaymentMethods().subscribe(function (paymentMethods) {
            _this.paymentMethods = paymentMethods;
            console.log(_this.paymentMethods);
        });
    };
    ExpensesComponent.prototype.getExpensesDetails = function () {
        var _this = this;
        this._expensesService.getExpenses().subscribe(function (expensesDetails) {
            _this.expensesDetails = expensesDetails;
            console.log(_this.expensesDetails);
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.addExpense = function () {
        var _this = this;
        this.expenseEdit.amount = this.expenseForm.get("amount").value;
        this.expenseEdit.date = this.expenseForm.get("date").value.jsdate;
        if (this.expenseEdit.date == undefined) {
            this.expenseEdit.date = new Date();
        }
        this.expenseEdit.place = this.expenseForm.get("place").value;
        // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
        this.expenseEdit.forPerson = this.expenseForm.get("forPerson").value;
        this.expenseEdit.cardId = this.expenseForm.get("paymentMethod").value;
        console.log(this.expenseEdit);
        this._expensesService.addExpense(this.expenseEdit).subscribe(function (res) {
            _this._expensesService.getExpenses().subscribe(function (expensesDetails) {
                _this.expensesDetails = expensesDetails;
                _this.resetFormValues();
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.closeUpdateExpense = function (expense) {
        expense.id = expense.id * -1;
        this.idUpdate = this.idUpdate * -1;
    };
    ExpensesComponent.prototype.openUpdateExpense = function (expense) {
        var _this = this;
        if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
            var exp = this.expensesDetails.expenses.find(function (x) { return x.id == _this.idUpdate; });
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
        this.expenseForm.get("anEvent_edit").setValue(expense.anEvent);
    };
    ExpensesComponent.prototype.openOrCloseUpdateExpense = function (expense) {
        var _this = this;
        // console.log(event);
        if (this.idUpdate && this.idUpdate < 0 && this.idUpdate != expense.id) {
            var exp = this.expensesDetails.expenses.find(function (x) { return x.id == _this.idUpdate; });
            exp.id = exp.id * -1;
        }
        expense.id = expense.id * -1;
        this.idUpdate = expense.id;
        this.expenseForm.get("amount_edit").setValue(expense.amount);
        this.expenseForm.get("date_edit").setValue(expense.date);
        this.expenseForm.get("place_edit").setValue(expense.place);
        this.expenseForm.get("forPerson_edit").setValue(expense.forPerson);
        this.expenseForm.get("paymentMethod_edit").setValue(expense.cardId);
        this.expenseForm.get("anEvent_edit").setValue(expense.anEvent);
    };
    ExpensesComponent.prototype.updateExpense = function (expenseId) {
        var _this = this;
        this.expenseEdit.amount = this.expenseForm.get("amount_edit").value;
        this.expenseEdit.date = this.expenseForm.get("date_edit").value.jsdate;
        if (this.expenseEdit.date == undefined) {
            this.expenseEdit.date = new Date();
        }
        this.expenseEdit.place = this.expenseForm.get("place_edit").value;
        this.expenseEdit.forPerson = this.expenseForm.get("forPerson_edit").value;
        this.expenseEdit.cardId = this.expenseForm.get("paymentMethod_edit").value;
        this.expenseEdit.anEvent = this.expenseForm.get("anEvent_edit").value;
        this.expenseEdit.id = expenseId > 0 ? expenseId : expenseId * -1;
        // console.log(this.expenseEdit);
        this._expensesService.updateExpense(this.expenseEdit).subscribe(function (res) {
            _this._expensesService.getExpenses().subscribe(function (expensesDetails) {
                _this.expensesDetails = expensesDetails;
                _this.resetFormValues();
            }, function (error) {
                console.log("-------------------updateExpense function: ");
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.addEvent = function () {
        this.expenseEdit.amount = this.expenseForm.get("amount").value;
        this.expenseEdit.date = this.expenseForm.get("date").value;
        this.expenseEdit.place = this.expenseForm.get("place").value;
        this.expenseEdit.forPerson = this.expenseForm.get("forPerson").value;
        this.expenseEdit.cardId = this.expenseForm.get("paymentMethod").value;
        this.expenseEdit.anEvent = true;
        this._eventExpenseService.expenseCreation = this.expenseEdit;
        this._router.navigate(["expenses/-1"]);
    };
    ExpensesComponent.prototype.openEvent = function (id) {
        this._router.navigate(["expenses/" + id]);
    };
    ExpensesComponent.prototype.resetFormValues = function () {
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
            forPerson_edit: '',
            anEvent_edit: ''
        });
        this.idUpdate = undefined;
    };
    __decorate([
        core_1.ViewChild(modal_component_1.ModalComponent),
        __metadata("design:type", modal_component_1.ModalComponent)
    ], ExpensesComponent.prototype, "modal", void 0);
    ExpensesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'expenses.component.html'
        }),
        __metadata("design:paramtypes", [expenses_service_1.ExpensesService,
            eventExpense_service_1.EventExpenseService,
            router_1.Router,
            forms_1.FormBuilder])
    ], ExpensesComponent);
    return ExpensesComponent;
}());
exports.ExpensesComponent = ExpensesComponent;
//# sourceMappingURL=expenses.component.js.map