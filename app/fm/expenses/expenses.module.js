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
var expenseEvent_component_1 = require("./expenseEvents/expenseEvent.component");
var expenseEvent_service_1 = require("./expenseEvents/expenseEvent.service");
var expenseEvent_guard_service_1 = require("./expenseEvents/expenseEvent-guard.service");
var ExpensesModule = (function () {
    function ExpensesModule() {
    }
    return ExpensesModule;
}());
ExpensesModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild([
                { path: 'expenses', component: expenses_component_1.ExpensesComponent },
                { path: 'expenses/:expenseId', canActivate: [expenseEvent_guard_service_1.ExpenseEventGuard], component: expenseEvent_component_1.ExpenseEventComponent }
            ]),
            common_1.CommonModule,
            ng2_smart_table_1.Ng2SmartTableModule,
            htCommon_module_1.HTCommonModule,
            forms_1.ReactiveFormsModule
        ],
        declarations: [
            expenses_component_1.ExpensesComponent,
            expenseEvent_component_1.ExpenseEventComponent
        ],
        providers: [
            expenses_service_1.ExpensesService,
            expenseEvent_service_1.ExpenseEventService,
            expenseEvent_guard_service_1.ExpenseEventGuard
        ]
    })
], ExpensesModule);
exports.ExpensesModule = ExpensesModule;
//# sourceMappingURL=expenses.module.js.map