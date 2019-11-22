import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {NotificationCreation} from "./models/notificatonCreation";
import {Creation, PageCheck} from "./models/creation";
import {AuthGuard} from "../../../../shared/services/auth.service";
import {LogoutService} from "../../../../shared/services/logout-service";
import {NotificationService} from "../service/notification-service";
import RouteUtils from "../../../../shared/utils/RouteUtils";
import {CookieService} from "ngx-cookie";
import {showErrorPopup} from "../../../../shared/utils";

@Component({
    selector: 'app-notification-creation',
    templateUrl: './notification-creation.component.html',
    styleUrls: ['./notification-creation.component.css']
})

export class NotificationCreationComponent extends DialogComponent<{ model: NotificationCreation }, NotificationCreation> implements OnInit {

    constructor(private notificationService: NotificationService,
                dialogService: DialogService,
                private router: Router,
                private translateService: TranslateService,
                private authGuard: AuthGuard,
                private blockUI: BlockUIService,
                private logoutService: LogoutService,
                private cookieService: CookieService) {
        super(dialogService);
    }

    public memoModules: Object = {
        toolbar: [
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
            ['bold', 'italic', 'underline', 'strike', 'link'],
            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
            [{'font': []}]
        ]
    };

    ngOnInit(): void {
        if (this.model.pageId) {
            let pageIdList = this.model.pageId.split(",");
            for (let i = 0; i < pageIdList.length; i++) {
                let id = pageIdList[i];
                if (id === "COMPETITOR") {
                    this.model.pageSummary = true;
                }
                if (id === "DEAL_LIST") {
                    this.model.pageDealDetail = true;
                }
                if (id === "NAVER_SEARCH") {
                    this.model.pageNaver = true;
                }
                if (id === "GROSS_REPORT") {
                    this.model.pageGR = true;
                }
                if (id === "PRICE_COMPARE") {
                    this.model.pagePriceComparision = true;
                }
                if (id === "PRO_BEST_OPT") {
                    this.model.pageBestOptions = true;
                }
            }
        }
    }

    model: NotificationCreation;

    ngOnDestroy() {

    }

    confirm() {

        let pageChecks: PageCheck[] = [];
        let pageCheck: PageCheck;

        if (this.model.pageSummary) {
            pageCheck = new PageCheck();
            pageCheck.pageId = "COMPETITOR";
            pageCheck.pageName = "조직별 영업실적";
            pageCheck.isChecked = false;
            pageChecks.push(pageCheck);
            this.cookieService.put(pageCheck.pageId, "true");
        }

        if (this.model.pageDealDetail) {
            pageCheck = new PageCheck();
            pageCheck.pageId = "DEAL_LIST";
            pageCheck.pageName = "딜별 영업실적";
            pageCheck.isChecked = false;
            pageChecks.push(pageCheck);
            this.cookieService.put(pageCheck.pageId, "true");
        }

        if (this.model.pageNaver) {
            pageCheck = new PageCheck();
            pageCheck.pageId = "NAVER_SEARCH";
            pageCheck.pageName = "실시간 키워드 검색";
            pageCheck.isChecked = false;
            pageChecks.push(pageCheck);
            this.cookieService.put(pageCheck.pageId, "true");
        }

        if (this.model.pageGR) {
            pageCheck = new PageCheck();
            pageCheck.pageId = "GROSS_REPORT";
            pageCheck.pageName = "GR 보고서";
            pageCheck.isChecked = false;
            pageChecks.push(pageCheck);
            this.cookieService.put(pageCheck.pageId, "true");
        }

        if (this.model.pagePriceComparision) {
            pageCheck = new PageCheck();
            pageCheck.pageId = "PRICE_COMPARE";
            pageCheck.pageName = "실시간 베스트";
            pageCheck.isChecked = false;
            pageChecks.push(pageCheck);
            this.cookieService.put(pageCheck.pageId, "true");
        }

        if (this.model.pageBestOptions) {
            pageCheck = new PageCheck();
            pageCheck.pageId = "PRO_BEST_OPT";
            pageCheck.pageName = "실시간 베스트(옵션)";
            pageCheck.isChecked = false;
            pageChecks.push(pageCheck);
            this.cookieService.put(pageCheck.pageId, "true");
        }

        if (!this.model.content) {
            this.translateService.get('message.notification_content_not_null').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
            return;
        }

        if (this.model.content.length > 1000) {
            this.translateService.get('message.notification_content_larger_than_1000').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
            return;
        }

        if (pageChecks.length === 0) {
            this.translateService.get('message.notification_page_check').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
            return;
        }


        if (this.model.srl) { // UPDATE, DELETE or CREATE
            let srlList = this.model.srl.split(",");
            let pageIdList = this.model.pageId.split(",");
            let pageNameList = this.model.pageName.split(",");

            for (let i = 0; i < srlList.length; i++) {
                let name = pageNameList[i];
                let check = pageChecks.find((item) => item.pageName === name);

                if (check) { // UPDATE
                    check.isChecked = true;

                    let creation: Creation = new Creation();
                    creation.content = this.model.content;
                    creation.pageId = check.pageId;
                    creation.pageName = name;
                    creation.srl = srlList[i];
                    creation.startDate = this.formatToDateTime(this.model.startDate.formatted, this.model.hourAtStartDate, this.model.minuteAtStartDate);
                    creation.endDate = this.formatToDateTime(this.model.endDate.formatted, this.model.hourAtEndDate, this.model.minuteAtEndDate);

                    this.notificationService.updateNotification(creation).subscribe(response => {
                        this.cookieService.put(creation.srl, "true");
                        RouteUtils.navigateTo(this.router, this.model.currentURL, this.model.notificationFilter.unbind(), true);
                    });

                } else { // DELETE
                    this.notificationService.deleteNotification(srlList[i]).subscribe(response => {
                        console.log(response);
                        RouteUtils.navigateTo(this.router, this.model.currentURL, this.model.notificationFilter.unbind(), true);
                    });
                }
            }

            for (let i = 0; i < pageChecks.length; i++) {
                if (!pageChecks[i].isChecked) {
                    let creation: Creation = new Creation();
                    creation.content = this.model.content;
                    creation.pageId = pageChecks[i].pageId;
                    creation.pageName = pageChecks[i].pageName;
                    creation.startDate = this.formatToDateTime(this.model.startDate.formatted, this.model.hourAtStartDate, this.model.minuteAtStartDate);
                    creation.endDate = this.formatToDateTime(this.model.endDate.formatted, this.model.hourAtEndDate, this.model.minuteAtEndDate);

                    console.log(creation);

                    this.notificationService.saveNotification(creation).subscribe(response => {
                        console.log(response);
                        RouteUtils.navigateTo(this.router, this.model.currentURL, this.model.notificationFilter.unbind(), true);
                    });
                }
            }

        } else { // CREATE
            for (let i = 0; i < pageChecks.length; i++) {
                let creation: Creation = new Creation();
                creation.content = this.model.content;
                creation.pageId = pageChecks[i].pageId;
                creation.pageName = pageChecks[i].pageName;
                creation.startDate = this.formatToDateTime(this.model.startDate.formatted, this.model.hourAtStartDate, this.model.minuteAtStartDate);
                creation.endDate = this.formatToDateTime(this.model.endDate.formatted, this.model.hourAtEndDate, this.model.minuteAtEndDate);

                console.log(creation);

                this.notificationService.saveNotification(creation).subscribe(response => {
                    console.log(response);
                    RouteUtils.navigateTo(this.router, this.model.currentURL, this.model.notificationFilter.unbind(), true);
                });
            }
        }
        this.close();
    }

    formatToDateTime(dateStr: string, hours: string, minutes: string) {
        let hourStr ='';
        let minutesStr='';

        if(hours ==='') {
            hourStr +='00';
            if(minutes =='') {
                minutesStr += '00';
            } else {
                minutesStr += minutes;
            }
        } else {
            hourStr = hours;
            if(minutes =='') {
                minutesStr += '00';
            } else {
                minutesStr += minutes;
            }
        }
        let timeStr = `${hourStr}:${minutesStr}:00`;
        return `${dateStr}T${timeStr}`;
    }

    cancel() {
        // this.result = false;
        this.close();
    }

    onContentChanged({quill, html, text}) {
        console.log('quill content is changed!', quill, html, text);
    }
}
