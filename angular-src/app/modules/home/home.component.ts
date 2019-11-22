import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from "ng2-bootstrap-modal";
import {BlockUIService} from "../../shared/services/block-ui.service";
import {Department, Register} from "../../shared/models/register";
import {BadRequestResponse} from "../../shared/models/bad-request-response";
import {AuthGuard} from "../../shared/services/auth.service";
import {AuthorityInfo, AuthorityInfoResponse} from "../../shared/models/authority-info";
import RouteUtils from "../../shared/utils/RouteUtils";
import {AlertComponent} from "../../common/alert/alert.component";
import {RegisterConfirmComponent} from "../register-confirm/register-confirm.component";
import {TranslateService} from "@ngx-translate/core";
import {doLogout} from "../../shared/utils";
import {Login} from "../../shared/models/login";
import {LogoutService} from "../../shared/services/logout-service";
import {CookieService} from "ngx-cookie";

const COMPETITOR_CATEGORY_URL = "/competitor-by-category";
const PAGE_COMPETITOR_BY_CATEGORY = "COMPETITOR";
const PAGE_DEAL_LIST = "DEAL_LIST";
const DEAL_LIST_URL = "/deal-list";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
})

export class HomeComponent {
    constructor(private router: Router,
                private dialogService: DialogService,
                private blockUI: BlockUIService,
                private authGuard: AuthGuard,
                private translateService: TranslateService,
                private logoutService: LogoutService,
                private cookieService: CookieService) {
    }

    ngOnInit() {
        this.username = window.localStorage.getItem('username');
        this.role = window.localStorage.getItem('role');
        let password = window.localStorage.getItem('password');

        window.localStorage.removeItem('password');
        if(this.username == "undefined"){
            doLogout(this.router, this.logoutService);
        }
        if(password != null)
            this.onFindAuthorityInfomation(new Login(this.username, password));
        else if (this.role != null && this.role != "undefined") {
            this.router.navigateByUrl(this.router.url);
        } else
            doLogout(this.router, this.logoutService);
    }

    data: AuthorityInfo;
    username: string;
    role: string;
    assignedCategories: string;

    handleAuthorization(): void {
        let errorTitle = this.translateService.instant("label.error");
        if (this.data == undefined || (this.data.authority == false && this.data.used == null)) {
            let model: Register = new Register();
            model.username = this.username;
            model.version = this.data.version;
            model.fullName = this.data.fullName;
            model.currentDepartment = this.data.currentDepartment;
            model.departments = this.data.departments;
            this.showRegisterConfirmPopup(model);
        }
        else if(this.data.authority == false && this.data.used === 'R'){
            let errorMsg = this.translateService.instant("message.error_waiting_approval")
            this.showErrorPopup(errorTitle, errorMsg, () => {
                doLogout(this.router, this.logoutService);
            });
        }
        else if(this.data.authority == false && this.data.used === 'N'){
            let errorMessage = this.translateService.instant("message.error_account_disabled");
            this.showErrorPopup(errorTitle, errorMessage, () => {
                doLogout(this.router, this.logoutService)
            });
        }else {
            let cache = this.cookieService.get("pageAuthorities") ;
            if (cache) {
                let pageAuthorities = JSON.parse(this.cookieService.get("pageAuthorities"));
                if (pageAuthorities && pageAuthorities.length > 0) {
                    if (pageAuthorities.find((item) => item.pageId === PAGE_COMPETITOR_BY_CATEGORY)) {
                        RouteUtils.navigateTo(this.router, COMPETITOR_CATEGORY_URL, null, true);
                    } else if (pageAuthorities.find((item) => item.pageId === PAGE_DEAL_LIST)) {
                        RouteUtils.navigateTo(this.router, DEAL_LIST_URL, null, true);
                    } else {
                        RouteUtils.navigateTo(this.router, pageAuthorities[0].pageUrl, null, true);
                    }
                }
            }
        }

    }

    private onFindAuthorityInfomation(login: Login): void {

        //this.blockUI.start();

        this.authGuard.getAuthorityInfo(login).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup("Exception", badRequestResponse.exceptionMsg, () => {

                    });
                    break;
                }
                case 'OK': {
                    let response = serverResponse as AuthorityInfoResponse;
                    this.data = response.data;
                    this.role = response.data.role;
                    this.assignedCategories = response.data.assignedCategories;

                    window.localStorage.setItem('role', this.role);
                    window.localStorage.setItem('assignedCategories', this.assignedCategories);
                    window.localStorage.setItem("authorityInfo", JSON.stringify(this.data));
                    this.cookieService.put("pageAuthorities", JSON.stringify(this.data.pageAuthorities));
                    this.handleAuthorization();
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop();
            }

        }, error => {
            console.log('error to get authority information', error);
            this.blockUI.stop();
        });
    }

    showErrorPopup(title: string, message: string, callBack: () => void): any {
        this.dialogService.addDialog(AlertComponent, {
            title: title,
            message: message,
        }).subscribe(() => {
            callBack();

        });
    }

    showRegisterConfirmPopup(model): void {
        this.dialogService.addDialog(RegisterConfirmComponent, {
            title: this.translateService.instant("login.failedTitlePopup"),
            message: this.translateService.instant("login.failedMessage"),
            model: model

        }).subscribe(() => {
        });
    }
}

