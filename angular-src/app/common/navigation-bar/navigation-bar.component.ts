import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {doLogout} from "../../shared/utils";
import {LogoutService} from "../../shared/services/logout-service";
import {AppliedSystem, Department, Register} from "../../shared/models/register";
import {RegisterComponent} from "../../modules/register/register.component";
import {BlockUIService} from "../../shared/services/block-ui.service";
import {DialogService} from "ng2-bootstrap-modal";
import {AuthGuard} from "../../shared/services/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthorityInfo} from "../../shared/models/authority-info";
import * as moment from "moment";
import {CookieService} from "ngx-cookie";

const C_PAGE_ID1 = "COMPETITOR";
const C_PAGE_ID2 = "DEAL_LIST";
const C_PAGE_ID3 = "GROSS_REPORT";
const C_PAGE_ID4 = "PRICE_COMPARE";
const C_PAGE_ID5 = "PRO_BEST_OPT";
const C_PAGE_ID6 = "NAVER_SEARCH";
@Component({
    selector: 'navigation-bar',
    templateUrl: 'navigation-bar.component.html',
    styleUrls: ['navigation-bar.component.css']
})
export class NavigationBarComponent {
    @Input() admin: boolean;

    role: string;
    currentDate: string;
    showPage1:boolean = false ;
    showPage2:boolean = false ;
    showPage3:boolean = false ;
    showPage4:boolean = false ;
    showPage5:boolean = false ;
    showPage6:boolean = false ;

    constructor(private router: Router,
                private dialogService: DialogService,
                private blockUI: BlockUIService,
                private authGuard: AuthGuard,
                private translateService: TranslateService,
                private cookieService: CookieService,
                private logoutService: LogoutService) {
        this.role = window.localStorage.getItem('role');
        this.currentDate = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
        let cache = this.cookieService.get("pageAuthorities") ;
        if (cache != null && cache != undefined) {
            let pageAuthorities = JSON.parse(this.cookieService.get("pageAuthorities"));
            if (pageAuthorities != null && pageAuthorities != undefined) {
                pageAuthorities.forEach((item) => {
                    if (item.pageId === C_PAGE_ID1) {
                        this.showPage1 = true;
                    }
                    if (item.pageId === C_PAGE_ID2) {
                        this.showPage2 = true;
                    }
                    if (item.pageId === C_PAGE_ID3) {
                        this.showPage3 = true;
                    }
                    if (item.pageId === C_PAGE_ID4) {
                        this.showPage4 = true;
                    }
                    if (item.pageId === C_PAGE_ID5) {
                        this.showPage5 = true;
                    }
                    if (item.pageId === C_PAGE_ID6) {
                        this.showPage6 = true;
                    }
                });

            }
        }
    }

    doLogout(): void {
        doLogout(this.router, this.logoutService);
    }

    getActiveStatus(tabName: string) {
        let rootUrl = this.router.url.split('?')[0];
        if (rootUrl === tabName) {
            return 'active';
        }
        return '';
    }
    showPopupRequestAuthorityChanges(): void {
        let register: Register = JSON.parse(window.localStorage.getItem("authorityInfo"));
        register.isRegister = false;
        register.username = window.localStorage.getItem('username');
        let assignedCategories = register['assignedCategories'];
        let categoriesMap = new Map<String, Department>();
        if(assignedCategories != undefined){
            let tmp = assignedCategories.split(";");
            if(tmp.length > 0){
                tmp.forEach(e => {
                    register.departments.forEach(f => {
                      if(f.id == e.toString()){
                          f.selected = true;
                      }
                      let department = new Department(f.id, f.name, f.selected);
                      categoriesMap.set(department.id, department);
                   });
                });
            }
        }
        register.newDepartments = Array.from(categoriesMap.values());
        register.userMemo = "";
        register.appliedToSystem = AppliedSystem.SNOOPY1_SNOOPY2;
        this.showRegisterPopup(register);
    }

    showRegisterPopup(model): void {
        let params = {
            model: {...model}
        };
        this.dialogService.addDialog(RegisterComponent, params).subscribe(model => {
            if (model) {
                this.blockUI.start();
            }
        });
    }
}