import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material';
import {AngularDraggableModule} from 'angular2-draggable';
import {MyDatePickerModule} from 'mydatepicker';
import {MarkdownToHtmlModule} from 'ng2-markdown-to-html';
import {PaginationModule, TypeaheadModule} from 'ngx-bootstrap';
import {BootstrapModalModule} from 'ng2-bootstrap-modal';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CookieModule, CookieService} from 'ngx-cookie';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import { QuillModule } from 'ngx-quill';

import {TestComponent} from './modules/test/test.component';
/* common components */
import {HomeComponent} from './modules/home/home.component';
import {AdminComponent} from './modules/admin/admin.component';
import {HeaderComponent} from './common/header/header.component';
import {FooterComponent} from './common/footer/footer.component';
import {NavigationBarComponent} from './common/navigation-bar/navigation-bar.component';
import {ReleaseNotesComponent} from './modules/release-notes/release-notes.component';
import {AlertComponent} from './common/alert/alert.component';
import {ConfirmComponent} from './common/confirm/confirm.component';
import {BlockUIComponent} from './common/block-ui/block-ui.component';
import {LanguageSelectorComponent} from './common/language-selector/language-selector.component';
import {FilterBtnComponent} from './common/filter-btn/filter-btn.component';
import {FilterPanelComponent} from './common/filter-panel/filter-panel.component';
import {DateRangeComponent} from './common/date-range/date-range.component';
import {SmartTableComponent} from './common/smart-table/smart-table.component';
import {SmartTableService} from './common/smart-table/smart-table.service';
import {DynamicComponent} from './common/dynamic/dynamic.component';
/* shared services */
import {ApiService} from './shared/services/api.service';
import {AuthGuard} from './shared/services/auth.service';
import {ModalService} from './shared/services/modal.service';
import {BlockUIService} from './shared/services/block-ui.service';
import {LanguageService} from './shared/services/language.service';
/** shared Pies */
import {OrdinalSuffixPipe} from './shared/pipes/ordinal-suffix.pipe';
import {SanitizeHtmlPipe} from './shared/pipes/sanitize-html.pipe';

import {AppComponent} from './app.component';
import {routing} from './app.routes';

import {LoginComponent} from './modules/login/login.component';
import {LoginService} from './shared/services/login.service';

import {DealService} from './modules/deal/services/deal-service';
import {DealListComponent} from './modules/deal/deal-list/deal-list.component';

import {CompetitorSummaryComponent} from './modules/competitor/competitor-summary/competitor-summary.component';
import {CompetitorService} from './modules/competitor/services/competitor-service';
import {CompetitorSummaryChartComponentComponent} from './modules/competitor/competitor-summary-chart-component/competitor-summary-chart-component.component';

import {RegionService} from './modules/admin/services/region.service';
import {RegionListComponent} from './modules/admin/region-list/region-list.component';
import {RegionEditComponent} from './modules/admin/region-edit/region-edit.component';

import {AreaService} from './modules/admin/services/area.service';
import {AreaListComponent} from './modules/admin/area-list/area-list.component';
import {AreaEditComponent} from './modules/admin/area-edit/area-edit.component';

import {CategoryService} from './modules/admin/services/category.service';
import {CategoryListComponent} from './modules/admin/category-list/category-list.component';
import {CategorySelectComponent} from './modules/admin/category-list/category-select/category-select.component';

import {CompetitorByCategoryComponent} from "./modules/competitor/competitor-by-category/competitor-by-category.component";
import {DealListDetailsComponent} from './modules/deal/deal-list-details/deal-list-details.component';
import {OptionSummaryComponent} from "./modules/admin/option/option-summary.component";
import {OptionSummaryService} from "./modules/admin/services/option-summary-service";
import {CompetitorBySubCategoryComponent} from "./modules/competitor/competitor-by-sub-category/competitor-by-sub-category.component";

import {RowDetailsComponent} from "./modules/deal/deal-list/row-details/row-details.component";
import {RowListDetailsComponent} from './modules/deal/deal-list-details/row-list-details/row-list-details.component';
import {OptionService} from "./shared/services/option.service";
import {RegisterComponent} from "./modules/register/register.component";
import {NotificationCreationComponent} from "./modules/admin/notification/creation/notification-creation.component";
import {NotificationDialogComponent} from "./modules/admin/notification/dialog/notification-dialog.component";
import {AuthorityApprovalComponent} from "app/modules/admin/authority-approval/authority-approval.component";
import {AuthorityService} from "./modules/admin/services/authority.service";
import {RegisterConfirmComponent} from './modules/register-confirm/register-confirm.component';
import {CategoryManagementComponent} from './modules/admin/category-management/category-management.component';
import {CreateCategoryPopupComponent} from './modules/admin/category-management/create-category-popup/create-category-popup.component';
import {CategoryManagementService} from "./modules/admin/services/category-management-service";
import {ChangeCategoryComponent} from './modules/admin/category-management/change-category/change-category.component';
import {RenewalOrganizationPopupComponent} from './modules/admin/category-management/renewal-organization-popup/renewal-organization-popup.component';
import {CategoryMappingService} from "./modules/admin/category-mappers/services/category-mappers.service";
import {CompetitorMappingComponent} from "./modules/admin/category-mappers/competitor-mapping/compettitor-mapping.component";
import {AuthorityUpdateComponent} from "./modules/admin/authority-approval-update/authority-update.component";
import {LogoutService} from "./shared/services/logout-service";
import {GrossReportService} from "./modules/gross-report/sevice/gross-report.service";
import {DealAreaListComponent} from "./modules/admin/deal-area-list/deal-area-list.component";

import {Injectable} from '@angular/core';
import {GrossReportComponent} from "./modules/gross-report/gross-report.component";
import { ReportAdjustmentComponent } from './modules/admin/report-adjustment/report-adjustment.component';
import {ReportAdjustmentService} from "./modules/admin/services/report-adjustment-service";
import {DateTimeRangeComponent} from "./common/date-time-range/date-time-range.component";
import {ProductRowDetailsComponent} from "./modules/admin/product-price-comparison/product-row-details/product-row-details.component";
import {ProductPriceComparisonComponent} from "./modules/admin/product-price-comparison/product-price-comparison.component";
import {ProductPriceComparisonService} from "./modules/admin/product-price-comparison/service/product-price-comparison-service";
import {ProductRankValueComponent} from "./modules/admin/product-price-comparison/product-rank-value/product-rank-value.component";
import {FileSelectDirective, FileUploadModule} from 'ng2-file-upload';
import {ProductBestOptionsComponent} from "./modules/product-best-options/product-best-options.component";
import {ProductOptionsRowDetailsComponent} from "./modules/product-best-options/product-options-row-details/product-options-row-details.component";
import {ProductRankOptionValueComponent} from "./modules/product-best-options/product-rank-option-value/product-rank-option-value.component";
import {ProductBestOptionService} from "./modules/product-best-options/service/product-best-option-service";
import {NaverSearchComponent} from "./modules/naver-search/naver-search.component";
import {NotificationComponent} from "./modules/admin/notification/notification.component";
import {NaverSearchService} from "./modules/naver-search/service/naver-search-service";
import {NotificationService} from "./modules/admin/notification/service/notification-service";
import {TabComponent} from "./modules/tab/tab.component";
import {TabsetComponent} from "./modules/tab/tabset.component";
import {NaverPriceComparisonComponent} from "./modules/admin/product-price-comparison/naver-price-comparision/naver-price-comparision.component";
import {NaverPriceComparisonService} from "./modules/admin/product-price-comparison/service/naver-price-comparision-service";
import {BestDealsComparisonComponent} from "./modules/admin/product-price-comparison/best-deals-comparision/best-deals-comparision.component";
import {BestDealsComparisonService} from "./modules/admin/product-price-comparison/service/best-deals-comparision-service";
import {CompetitorByCategoryGuard} from "./modules/competitor/competitor-by-category/competitor-by-category-guard.service";
import {DealListGuard} from "./modules/deal/deal-list/deal-list-guard.service";
import {GrossReportGuard} from "./modules/gross-report/gross-report-guard.service";
import {ProductPriceComparisonGuard} from "./modules/admin/product-price-comparison/product-price-comparison-guard.service";
import {BestDealComparisonGuard} from "./modules/admin/product-price-comparison/best-deals-comparision/best-price-comparison-guard.service";
import {NaverSearchGuard} from "./modules/naver-search/naver-search-guard.service";

import {AuditActionService} from "./modules/admin/monitor-user-activities/service/monitor-user-activities-service";
import {DailyStatusMonitorComponent} from "./modules/admin/monitor-user-activities/daily-status-monitor/daily-status-monitor.component";
import {DetailedMenuMonitorComponent} from "./modules/admin/monitor-user-activities/detailed-menu-monitor.component";
import {DetailedUserMonitorComponent} from "./modules/admin/monitor-user-activities/detailed-user-monitor/detailed-user-monitor.component";
import {DetailedTeamMonitorComponent} from "./modules/admin/monitor-user-activities/detailed-team-monitor/detailed-team-monitor.component";

@Injectable()
export class RedirectGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        window.location.href = route.data['externalUrl'];
        return true;

    }
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [BrowserModule, routing,
        HttpModule,
        JsonpModule,
        FormsModule,
        HttpClientModule,
        PaginationModule.forRoot(),
        BootstrapModalModule,
        MatProgressSpinnerModule,
        MarkdownToHtmlModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        TypeaheadModule.forRoot(),
        CookieModule.forRoot(),
        AngularDraggableModule,
        MyDatePickerModule,
        QuillModule,
        FileUploadModule
    ],

    declarations: [
        TestComponent,
        AppComponent,
        HomeComponent,
        AdminComponent,
        HeaderComponent,
        FooterComponent,
        NavigationBarComponent,
        LanguageSelectorComponent,
        FilterBtnComponent,
        FilterPanelComponent,
        DateRangeComponent,
        DateTimeRangeComponent,
        SmartTableComponent,
        DynamicComponent,
        OrdinalSuffixPipe,
        SanitizeHtmlPipe,
        AlertComponent,
        ConfirmComponent,
        LoginComponent,
        BlockUIComponent,
        ReleaseNotesComponent,
        DealListComponent,
        CompetitorSummaryComponent,
        CompetitorSummaryChartComponentComponent,
        CompetitorByCategoryComponent,
        CompetitorBySubCategoryComponent,
        DealAreaListComponent,
        RegionListComponent,
        RegionEditComponent,
        AreaListComponent,
        AreaEditComponent,
        CategorySelectComponent,
        CategoryListComponent,
        DealListDetailsComponent,
        OptionSummaryComponent,
        RowDetailsComponent,
        RowListDetailsComponent,
        RegisterComponent,
        AuthorityApprovalComponent,
        AuthorityUpdateComponent,
        RegisterConfirmComponent,
        CategoryManagementComponent,
        CreateCategoryPopupComponent,
        ChangeCategoryComponent,
        RenewalOrganizationPopupComponent,
        CompetitorMappingComponent,
        GrossReportComponent,
        ReportAdjustmentComponent,
        ProductPriceComparisonComponent,
        ProductRowDetailsComponent,
        ProductRankValueComponent,
        ProductRankOptionValueComponent,
        ProductBestOptionsComponent,
        ProductOptionsRowDetailsComponent,
        NaverSearchComponent,
        NotificationComponent,
        NotificationCreationComponent,
        NotificationDialogComponent,
        TabComponent,
        TabsetComponent,
        NaverPriceComparisonComponent,
        DetailedMenuMonitorComponent,
        DetailedUserMonitorComponent,
        DetailedTeamMonitorComponent,
        DailyStatusMonitorComponent,
        BestDealsComparisonComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        TranslateService,
        LanguageService,
        CookieService,
        SmartTableService,
        ApiService,
        ModalService,
        AuthGuard,
        CompetitorByCategoryGuard,
        DealListGuard,
        GrossReportGuard,
        ProductPriceComparisonGuard,
        BestDealComparisonGuard,
        NaverSearchGuard,
        BlockUIService,
        LoginService,
        LogoutService,
        DatePipe,
        DealService,
        CompetitorService,

        RegionService,
        AreaService,
        CategoryService,
        OptionSummaryService,
        RowDetailsComponent,
        RowListDetailsComponent,
        OptionService,
        AuthorityService,
        CategoryManagementService,
        CategoryMappingService,
        GrossReportService,
        ProductPriceComparisonService,
        RedirectGuard,
        ReportAdjustmentService,
        ProductBestOptionService,
        NaverSearchService,
        NotificationService,
        NaverPriceComparisonService,
        AuditActionService,
        BestDealsComparisonService
    ],
    entryComponents: [
        RegionEditComponent,
        AreaEditComponent,
        CategorySelectComponent,
        DynamicComponent,
        FilterBtnComponent,
        AlertComponent,
        ConfirmComponent,
        BlockUIComponent,
        RowDetailsComponent,
        RowListDetailsComponent,
        RegisterConfirmComponent,
        CreateCategoryPopupComponent,
        RenewalOrganizationPopupComponent,
        ProductRowDetailsComponent,
        ProductRankValueComponent,
        ProductRankOptionValueComponent,
        NotificationCreationComponent,
        NotificationDialogComponent,
        ProductOptionsRowDetailsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
