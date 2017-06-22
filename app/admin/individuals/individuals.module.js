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
var individuals_component_1 = require("./individuals.component");
var individuals_service_1 = require("./individuals.service");
var individualDetails_service_1 = require("./individualDetails.service");
var individualDetails_component_1 = require("./individualDetails.component");
var individualDetails_guard_service_1 = require("./individualDetails-guard.service");
var individualUpdate_service_1 = require("./individualUpdate.service");
var individualUpdate_component_1 = require("./individualUpdate.component");
var individualUpdate_guard_service_1 = require("./individualUpdate-guard.service");
var forms_1 = require("@angular/forms");
var individualAdd_component_1 = require("./individualAdd.component");
var individualAdd_service_1 = require("./individualAdd.service");
var login_1 = require("./login/login");
var htCommon_module_1 = require("../../common/htCommon.module");
var modal_component_1 = require("../../common/modal/modal.component");
var IndividualsModule = (function () {
    function IndividualsModule() {
    }
    return IndividualsModule;
}());
IndividualsModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild([
                { path: 'admin/individuals', component: individuals_component_1.IndividualsComponent },
                {
                    path: 'admin/individuals/details',
                    canActivate: [individualDetails_guard_service_1.IndividualDetailsGuard],
                    component: individualDetails_component_1.IndividualDetailsComponent
                },
                {
                    path: 'admin/individuals/update',
                    canActivate: [individualUpdate_guard_service_1.IndividualUpdateGuard],
                    component: individualUpdate_component_1.IndividualUpdateComponent
                },
                { path: 'admin/individuals/add', component: individualAdd_component_1.IndividualAddComponent },
            ]),
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            htCommon_module_1.HTCommonModule
        ],
        declarations: [
            individuals_component_1.IndividualsComponent,
            individualDetails_component_1.IndividualDetailsComponent,
            individualUpdate_component_1.IndividualUpdateComponent,
            individualAdd_component_1.IndividualAddComponent,
            login_1.Login
        ],
        providers: [
            individuals_service_1.IndividualsService,
            individualDetails_service_1.IndividualDetailsService,
            individualDetails_guard_service_1.IndividualDetailsGuard,
            individualUpdate_service_1.IndividualUpdateService,
            individualUpdate_guard_service_1.IndividualUpdateGuard,
            individualAdd_service_1.IndividualAddService
        ],
        entryComponents: [modal_component_1.ModalComponent, login_1.Login]
    })
], IndividualsModule);
exports.IndividualsModule = IndividualsModule;
//# sourceMappingURL=individuals.module.js.map