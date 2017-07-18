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
var ExpensesComponent = (function () {
    function ExpensesComponent(_usersService, _router, fb) {
        this._usersService = _usersService;
        this._router = _router;
        this.fb = fb;
        this.loaderOpen = true;
        // editHidden: boolean = false;
        this.expenseEdit = new expense_1.Expense();
        this.pageTitle = 'Expenses';
    }
    ExpensesComponent.prototype.ngOnInit = function () {
        this.getExpenses();
        this.getExpensesDetails();
        this.getPaymentMethods();
        this.expensesForm = this.fb.group({
            amount: ['', [forms_1.Validators.required]],
            date: [''],
            place: [''],
            paymentMethod: ['', [forms_1.Validators.required]],
            forPerson: ['']
        });
    };
    ExpensesComponent.prototype.getExpenses = function () {
        var _this = this;
        this._usersService.getExpenses().subscribe(function (expenses) {
            _this.expenses = expenses;
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.getPaymentMethods = function () {
        var _this = this;
        this._usersService.getPaymentMethods().subscribe(function (paymentMethods) {
            _this.paymentMethods = paymentMethods;
            console.log(_this.paymentMethods);
        });
    };
    ExpensesComponent.prototype.getExpensesDetails = function () {
        var _this = this;
        this._usersService.getExpensesDetails().subscribe(function (expensesDetails) {
            _this.expensesDetails = expensesDetails;
            console.log(_this.expensesDetails);
            _this.loaderOpen = false;
        }, function (error) {
            console.log(error);
        });
    };
    ExpensesComponent.prototype.editUser = function () {
        // this._router.navigate(["admin/usersUpdate"]);
        // this.popupUsersUpdate();
    };
    // popupUsersUpdate(): void {
    //   this.modal.modalTitle = "User Update";
    //   this.modal.modalFooter = false;
    //   this.modal.modalMessage = true;
    //   this.modal.documentWidth = 800;
    //   // this.modal.message = "Here Users Update component will load.";
    //   this.modal.open(UsersUpdateComponent);
    // }
    ExpensesComponent.prototype.editExpense = function () {
        this.expenseEdit.amount = this.expensesForm.get("amount").value;
        this.expenseEdit.date = this.expensesForm.get("date").value;
        this.expenseEdit.place = this.expensesForm.get("place").value;
        this.expenseEdit.paymentMethod = this.expensesForm.get("paymentMethod").value;
        this.expenseEdit.forPerson = this.expensesForm.get("forPerson").value;
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
        router_1.Router,
        forms_1.FormBuilder])
], ExpensesComponent);
exports.ExpensesComponent = ExpensesComponent;
//# sourceMappingURL=expenses.component.js.map