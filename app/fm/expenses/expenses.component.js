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
        this.pageTitle = 'Expenses';
    }
    ExpensesComponent.prototype.ngOnInit = function () {
        var _this = this;
        Rx_1.Observable.forkJoin(this._expensesService.getExpenses(), this._expensesService.getPaymentMethods()).subscribe(function (data) {
            _this.expensesDetails = data[0];
            _this.paymentMethods = data[1];
            console.log(_this.paymentMethods);
            console.log(_this.expensesDetails);
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
    ExpensesComponent.prototype.addExpense = function (expense) {
        this._expensesService.addExpense(expense).subscribe(function (res) {
            console.log(res);
        });
    };
    ExpensesComponent.prototype.updateExpense = function (expense) {
        var _this = this;
        if (this.idUpdate != expense.id && this.idUpdate) {
            var exp = this.expensesDetails.expenses.find(function (x) { return x.id == _this.idUpdate; });
            exp.id = exp.id * -1;
        }
        expense.id = expense.id * -1;
        this.idUpdate = expense.id;
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
    ExpensesComponent.prototype.editExpense = function () {
        var _this = this;
        this.expenseEdit.amount = this.expensesForm.get("amount").value;
        this.expenseEdit.date = this.expensesForm.get("date").value;
        this.expenseEdit.place = this.expensesForm.get("place").value;
        // this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
        this.expenseEdit.forPerson = this.expensesForm.get("forPerson").value;
        this.expenseEdit.cardId = this.expensesForm.get("paymentMethod").value;
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
    ExpensesComponent.prototype.addEvent = function () {
        this.expenseEdit.amount = this.expensesForm.get("amount").value;
        this.expenseEdit.date = this.expensesForm.get("date").value;
        this.expenseEdit.place = this.expensesForm.get("place").value;
        this.expenseEdit.forPerson = this.expensesForm.get("forPerson").value;
        this.expenseEdit.cardId = this.expensesForm.get("paymentMethod").value;
        this.expenseEdit.anEvent = true;
        this._eventExpenseService.expenseCreation = this.expenseEdit;
        this._router.navigate(["expenses/-1"]);
        // this._expensesService.addExpense(this.expenseEdit).subscribe(
        //   (res) => {
        //     console.log(res);
        //     this.loaderOpen = false;
        //     this._router.navigate(["expenses/" + res.expenseId]);
        //   }
        // );
    };
    ExpensesComponent.prototype.openEvent = function (id) {
        this._router.navigate(["expenses/" + id]);
    };
    ExpensesComponent.prototype.resetFormValues = function () {
        this.expensesForm.setValue({
            amount: '',
            date: '',
            place: '',
            paymentMethod: '',
            forPerson: ''
        });
    };
    return ExpensesComponent;
}());
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
exports.ExpensesComponent = ExpensesComponent;
//# sourceMappingURL=expenses.component.js.map