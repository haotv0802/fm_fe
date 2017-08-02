"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var ng2_smart_table_1 = require("ng2-smart-table");
var htCommon_module_1 = require("../../common/htCommon.module");
var expenses_component_1 = require("./expenses.component");
var expenses_service_1 = require("./expenses.service");
var forms_1 = require("@angular/forms");
var eventExpense_component_1 = require("./eventExpenses/eventExpense.component");
var eventExpense_guard_service_1 = require("./eventExpenses/eventExpense-guard.service");
var eventExpense_service_1 = require("./eventExpenses/eventExpense.service");
var ExpensesModule = (function () {
    function ExpensesModule() {
    }
    ExpensesModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forChild([
                    { path: 'expenses', component: expenses_component_1.ExpensesComponent },
                    { path: 'expenses/:expenseId', canActivate: [eventExpense_guard_service_1.EventExpenseGuard], component: eventExpense_component_1.EventExpenseComponent }
                ]),
                common_1.CommonModule,
                ng2_smart_table_1.Ng2SmartTableModule,
                htCommon_module_1.HTCommonModule,
                forms_1.ReactiveFormsModule
            ],
            declarations: [
                expenses_component_1.ExpensesComponent,
                eventExpense_component_1.EventExpenseComponent
            ],
            providers: [
                expenses_service_1.ExpensesService,
                eventExpense_service_1.EventExpenseService,
                eventExpense_guard_service_1.EventExpenseGuard
            ]
        })
    ], ExpensesModule);
    return ExpensesModule;
}());
exports.ExpensesModule = ExpensesModule;
//# sourceMappingURL=expenses.module.js.map