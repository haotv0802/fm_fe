import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {LogoutService} from "../../../../shared/services/logout-service";
import {NotificationService} from "../service/notification-service";
import {Notification} from "../models/Notification";
import {CookieOptions, CookieService} from "ngx-cookie";
import { DomSanitizer } from '@angular/platform-browser';
import {showErrorPopup} from "../../../../shared/utils";

@Component({
    selector: 'app-notification-creation',
    templateUrl: './notification-dialog.component.html',
    styleUrls: ['./notification-dialog.component.css']
})

export class NotificationDialogComponent extends DialogComponent<{ model: Notification }, Notification> implements OnInit {

    constructor(private notificationService: NotificationService,
                dialogService: DialogService,
                private translateService: TranslateService,
                private blockUI: BlockUIService,
                private logoutService: LogoutService,
                private cookieService: CookieService,
                private sanitizer: DomSanitizer
    ) {
        super(dialogService);

    }

    ngOnInit(): void {
    }

    model: Notification;

    handleCheck(event) {
        let option: CookieOptions = new class implements CookieOptions {
            domain: string;
            expires: string | Date;
            httpOnly: boolean;
            path: string;
            secure: boolean;
            storeUnencoded: boolean;
        };
        let date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0,0,0,0);
        option.expires = date;

        if (event.target.checked) {
            this.notificationService.getNotificationsByContentAndDateTime(this.model.content, this.model.startDate, this.model.endDate).subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    let notification: Notification = data[i] as Notification;
                    this.cookieService.put(notification.srl, "false", option);
                }
            }, error => {
                this.translateService.get('message.err_loading_notification').subscribe(msg => {
                    showErrorPopup(this.dialogService, this.translateService, msg);
                });
            });
        }
        // else {
        //     this.cookieService.put(this.model.srl, event.target.checked ? "false" : "true", option);
        // }
    }

    transform(content) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    ngOnDestroy() {

    }

    confirm() {

        this.close();
    }

    cancel() {
        // this.result = false;
        this.close();
    }
}
