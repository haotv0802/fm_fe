import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogService} from "ng2-bootstrap-modal";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {Pagination} from "../../../shared/models/pagination";
import {PageRequest} from "../../../shared/models/page-request";
import {NotificationService} from "./service/notification-service";
import {NotificationCreation} from "./creation/models/notificatonCreation";
import {NotificationCreationComponent} from "./creation/notification-creation.component";
import {Notification, NotificationFilter} from "./models/Notification";
import {createIMyDateModel, showErrorPopup} from "../../../shared/utils";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {Subscription} from "rxjs";

const CURRENT_URL = '/admin/notification';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})

export class NotificationComponent implements OnInit {

    constructor(private notificationService: NotificationService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService) {

        this.blockUI.vRef = this.viewContainerRef;
    }
    disableBtn: boolean = false;

    dataSettings: object = {
        table: {
            translate: true,
            tableScroll: true,
            tableScrollHeight: '600px'
        }
    };
    navSubscription: Subscription;

    notificationFilter: NotificationFilter = new NotificationFilter();
    isUpdateMode: boolean = false;

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    notificationList: Notification[] = [];
    pagination: Pagination = new Pagination(new PageRequest());

    ngOnInit() {
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let contextRoot = event["url"];
            let params = RouteUtils.extractParams(this.route, {});
            this.notificationFilter = new NotificationFilter();
            if (contextRoot != CURRENT_URL) {
                this.notificationFilter.bind(params);
                this.pagination.pageRequest.reset();
            }
            this.onLoadNotificationsList();
        });
    }

    handleCheck(event, notification: Notification) {
        notification.isChecked = event.target.checked;
        let i = 0;
        for (;i < this.notificationList.length; i++) {
            if (this.notificationList[i].isChecked) {
                break;
            }
        }
        if (i === this.notificationList.length) {
            this.isUpdateMode = false;
        } else {
            this.isUpdateMode = true;
        }
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) {
            this.pagination.pageRequest.page = event.page - 1;
            RouteUtils.navigateTo(this.router, CURRENT_URL, this.notificationFilter.unbind(), true);
            this.onLoadNotificationsList();
        }
    }

    onLoadNotificationsList() {
        this.notificationService.getNotifications(this.notificationFilter.status, this.notificationFilter.content).subscribe(data => {
            this.notificationList = this.buildNotifications(data as Notification[]);
        }, error => {
            this.disableBtn = false;
            this.translateService.get('message.err_unknown').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
        });
        this.isUpdateMode = false;
    }

    buildNotifications(notifications: Notification[]) {

        if (!notifications || notifications.length === 0) {
            return [];
        }

        let notification: Notification = notifications[0];

        let position = 50;
        let content = notification.contentWithoutTag;
        let newContent = notification.contentWithoutTag;
        if (content.length > position) {
            newContent = '';
            for (let i = 0; i < content.length; i++) {
                newContent += content.charAt(i);
                if ((i + 1) % position === 0) {
                    newContent += '\n\r';
                }
            }
        }
        notification.contentWithoutTag = newContent;

        let newNotifications: Notification[] = [];
        newNotifications.push(notification);

        for (let i = 1; i < notifications.length; i++) {
            let item = notifications[i];

            if (item.startDate === notification.startDate && item.endDate === notification.endDate && item.content === notification.content) {
                notification.pageName = notification.pageName + "," + item.pageName;
                notification.pageId = notification.pageId + "," + item.pageId;
                notification.srl = notification.srl + "," + item.srl;
            } else {
                notification = item;
                content = item.contentWithoutTag;
                newContent = item.contentWithoutTag;
                if (content.length > position) {
                    newContent = '';
                    for (let i = 0; i < content.length; i++) {
                        newContent += content.charAt(i);
                        if ((i  + 1)% position === 0) {
                            newContent += '\n\r';
                        }
                    }
                }

                notification.contentWithoutTag = newContent;
                newNotifications.push(notification);
            }
        }

        return newNotifications;
    }

    onSearch(): void {
        // this.blockUI.start();
        this.pagination.pageRequest.page = this.pagination.pageRequest.page - 1;
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.notificationFilter.unbind(), true);
    }

    onCreation(): void {
        let notificationEdit = undefined;
        let checkCounts: number = 0;

        for (let index = 0; index < this.notificationList.length; index++) {
            let notification: Notification = this.notificationList[index];
            if (notification.isChecked) {
                notificationEdit = notification;
                checkCounts++;
            }
        }

        if (checkCounts > 1) {
            this.translateService.get('message.only_1_row').subscribe(msg => {
                showErrorPopup(this.dialogService, this.translateService, msg);
            });
            return;
        }

        let creation: NotificationCreation = new NotificationCreation();
        creation.currentURL = CURRENT_URL;
        creation.notificationFilter = this.notificationFilter;
        let newDate = new Date();
        creation.hourAtStartDate = newDate.getHours() < 10 ? ("0" + newDate.getHours().toString()) : newDate.getHours().toString();
        creation.minuteAtStartDate = "00";
        creation.hourAtEndDate = newDate.getHours() < 10 ? ("0" + newDate.getHours().toString()) : newDate.getHours().toString();
        creation.minuteAtEndDate = "00";

        if (checkCounts == 1) {

            let startDate = new Date(notificationEdit.startDate);
            let endDate = new Date(notificationEdit.endDate);


            creation.pageName = notificationEdit.pageName;
            creation.pageId = notificationEdit.pageId;
            creation.startDate = createIMyDateModel(startDate);
            creation.endDate = createIMyDateModel(endDate);
            creation.content = notificationEdit.content;
            creation.srl = notificationEdit.srl + "";
            creation.hourAtStartDate = startDate.getHours() < 10 ? ("0" + startDate.getHours().toString()) : startDate.getHours().toString();
            creation.minuteAtStartDate = startDate.getMinutes() < 10 ? ("0" + startDate.getMinutes().toString()) : startDate.getMinutes().toString();
            creation.hourAtEndDate = endDate.getHours() < 10 ? ("0" + endDate.getHours().toString()) : endDate.getHours().toString();
            creation.minuteAtEndDate = endDate.getMinutes() < 10 ? ("0" + endDate.getMinutes().toString()) : endDate.getMinutes().toString();
        }

        let params = {
            model: {...creation}
        };

        this.dialogService.addDialog(NotificationCreationComponent, params).subscribe(model => {
            if (model) {
                this.blockUI.start();
            }
        });
    }

    resetData() {
        this.pagination = new Pagination(new PageRequest());
        this.pagination.pageRequest.reset();
    }

}