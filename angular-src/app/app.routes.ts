import {RouterModule, Routes} from '@angular/router';

import {TestComponent} from './modules/test/test.component';

import {AuthGuard} from './shared/services/auth.service';
import {HomeComponent} from './modules/home/home.component';
// import {AdminComponent} from './modules/admin/admin.component';
import {LoginComponent} from './modules/login/login.component';
import {ReleaseNotesComponent} from './modules/release-notes/release-notes.component';
import {DealListComponent} from './modules/deal/deal-list/deal-list.component';
// import {CompetitorSummaryComponent} from './modules/competitor/competitor-summary/competitor-summary.component';
// import { RegionListComponent } from './modules/admin/region-list/region-list.component';
// import { AreaListComponent } from './modules/admin/area-list/area-list.component';
// import { DealAreaListComponent } from './modules/admin/deal-area-list/deal-area-list.component';
// import { CategoryListComponent } from './modules/admin/category-list/category-list.component';
// import {KeywordStatusComponent} from "./modules/admin/keyword/keyword-status/keyword-status.component";
import {CompetitorByCategoryComponent} from "./modules/competitor/competitor-by-category/competitor-by-category.component";
import {CompetitorByCategoryGuard} from "./modules/competitor/competitor-by-category/competitor-by-category-guard.service";
import {RegisterComponent} from "./modules/register/register.component";
import {CategoryListComponent} from "./modules/admin/category-list/category-list.component";
import {AdminComponent} from "./modules/admin/admin.component";
import {AreaListComponent} from "./modules/admin/area-list/area-list.component";
import {RegionListComponent} from "./modules/admin/region-list/region-list.component";
import {AuthorityApprovalComponent} from "./modules/admin/authority-approval/authority-approval.component";
import {CategoryManagementComponent} from "./modules/admin/category-management/category-management.component";
import {ChangeCategoryComponent} from "./modules/admin/category-management/change-category/change-category.component";
import {CompetitorMappingComponent} from "./modules/admin/category-mappers/competitor-mapping/compettitor-mapping.component";
import {AuthorityUpdateComponent} from "./modules/admin/authority-approval-update/authority-update.component";
import {DynamicComponent} from "./common/dynamic/dynamic.component";
import {RedirectGuard} from "./app.module";
import {GrossReportComponent} from "./modules/gross-report/gross-report.component";
import {ReportAdjustmentComponent} from "./modules/admin/report-adjustment/report-adjustment.component";
import {ProductPriceComparisonComponent} from "./modules/admin/product-price-comparison/product-price-comparison.component";
import {ProductBestOptionsComponent} from "./modules/product-best-options/product-best-options.component";
import {NaverSearchComponent} from "./modules/naver-search/naver-search.component";
import {NotificationComponent} from "./modules/admin/notification/notification.component";
import {DailyStatusMonitorComponent} from "./modules/admin/monitor-user-activities/daily-status-monitor/daily-status-monitor.component";
import {DetailedMenuMonitorComponent} from "./modules/admin/monitor-user-activities/detailed-menu-monitor.component";
import {BestDealsComparisonComponent} from "./modules/admin/product-price-comparison/best-deals-comparision/best-deals-comparision.component";
import {DealListGuard} from "./modules/deal/deal-list/deal-list-guard.service";
import {GrossReportGuard} from "./modules/gross-report/gross-report-guard.service";
import {ProductPriceComparisonGuard} from "./modules/admin/product-price-comparison/product-price-comparison-guard.service";
import {BestDealComparisonGuard} from "./modules/admin/product-price-comparison/best-deals-comparision/best-price-comparison-guard.service";
import {NaverSearchGuard} from "./modules/naver-search/naver-search-guard.service";
// import {DealListDetailsComponent} from "./modules/deal/deal-list-details/deal-list-details.component";
// import {KeywordSummaryComponent} from "./modules/admin/keyword/keyword-summary/keyword-summary.component";
// import {OptionSummaryComponent} from "./modules/admin/option/option-summary.component";
// import {KeywordStatusDetailsComponent} from "./modules/admin/keyword/keyword-status-details/keyword-status-details.component";
// import {CompetitorBySubCategoryComponent} from "./modules/competitor/competitor-by-sub-category/competitor-by-sub-category.component";
// import {SmartKeywordComponent} from "./modules/admin/keyword/smart-keyword/smart-keyword.component";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
         children: [
             // {path: '', redirectTo: 'deal-list', pathMatch: 'full'},
             {path: 'deal-list', component: DealListComponent, canActivate: [DealListGuard]},
             {path: 'release-notes', component: ReleaseNotesComponent},
             // {path: 'competitor-summary', component: CompetitorSummaryComponent},
             {path: 'competitor-by-category', component: CompetitorByCategoryComponent, canActivate: [CompetitorByCategoryGuard]},
             // {path: 'competitor-by-sub-category', component: CompetitorBySubCategoryComponent },
             // {path: 'deal-list-details', component: DealListDetailsComponent }
             {path: 'register', component: RegisterComponent},
             {path: 'gross-report', component: GrossReportComponent, canActivate: [GrossReportGuard]},
             {path: 'product-price-comparison', component: ProductPriceComparisonComponent, canActivate: [ProductPriceComparisonGuard]},
             {path: 'product-best-options', component: ProductBestOptionsComponent},
             {path: 'naver-search', component: NaverSearchComponent, canActivate: [NaverSearchGuard]},
             {path: 'best-deal-comparision', component: BestDealsComparisonComponent, canActivate: [BestDealComparisonGuard]}
         ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', redirectTo: 'category-management', pathMatch: 'full'},
            {path: 'category-list', component: CategoryListComponent},
            // {path: 'area-list', component: DealAreaListComponent},
            {path: 'address-list', component: AreaListComponent},
            {path: 'region-list', component: RegionListComponent},
            {path: 'release-notes', component: ReleaseNotesComponent},
            // {path: 'keyword-summary', component: KeywordSummaryComponent},
            // {path: 'option-summary', component: OptionSummaryComponent},
            // {path: 'smart-keyword', component: SmartKeywordComponent},
            {path: 'category-management', component: CategoryManagementComponent},
            {path: 'category-change-mode', component: ChangeCategoryComponent},
            {path: 'competitor-mapping', component: CompetitorMappingComponent},
            {path: 'authority-approval', component: AuthorityApprovalComponent},
            {path: 'authority-update', component: AuthorityUpdateComponent},
            {path: 'report-adjustment', component: ReportAdjustmentComponent},
            {path: 'notification', component: NotificationComponent},
            {path: 'monitor-user-activities', component: DetailedMenuMonitorComponent},
            {path: 'product-price-comparison', component: ProductPriceComparisonComponent}

        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'test',
        component: TestComponent
    },
    {
        path: '**', redirectTo: '/'
    }
];

export const routing = RouterModule.forRoot(routes);
