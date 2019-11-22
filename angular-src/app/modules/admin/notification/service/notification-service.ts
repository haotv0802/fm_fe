import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http, URLSearchParams} from "@angular/http";
import {ApiService} from "../../../../shared/services/api.service";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {Creation} from "../creation/models/creation";

const NOTIFICATION = 'api/notification/page';
const GET_NOTIFICATION = 'api/notification/list';
const GET_NOTIFICATION_BY_PAGE_ID = 'api/notification/check';
const GET_NOTIFICATION_BY_CONTENT_DATETIME = 'api/notification/listByContentAndDateTime';

@Injectable()
export class NotificationService {

    constructor(private apiService: ApiService,
                private http: Http,
                private blockUI: BlockUIService) {
    }

    saveNotification(creation: Creation) {
        return this.apiService.post(NOTIFICATION, creation).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
        ;
    }

    updateNotification(creation: Creation) {
        return this.apiService.put(NOTIFICATION, creation).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
            ;
    }

    deleteNotification(srl: string) {
        return this.apiService.delete(NOTIFICATION + `?srl=${srl}`).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
            ;
    }

    getNotificationsByContentAndDateTime(content: string, startDate: string, endDate: string) {
        let params = new Map<string, string>();
        params.set("content",  content != null ? content.toString(): "");
        params.set("startDate",  startDate != null ? startDate.toString(): "");
        params.set("endDate",  endDate != null ? endDate.toString(): "");

        return this.apiService.get(GET_NOTIFICATION_BY_CONTENT_DATETIME, this.buildParameter(params)).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }

    getNotificationByPageId(pageId: string) {
        let params = new Map<string, string>();
        params.set("pageId",  pageId);
        params.set("curDateTime",  this.formatToLocalDateTime(new Date()));

        return this.apiService.get(GET_NOTIFICATION_BY_PAGE_ID, this.buildParameter(params)).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }

    getNotifications(status: string, content: string) {
        let params = new Map<string, string>();
        params.set("status",  status != null ? status.toString(): "");
        params.set("content",  content != null ? content.toString(): "");

        return this.apiService.get(GET_NOTIFICATION, this.buildParameter(params)).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }

    buildParameter(params: Map<string, string>){

        let searchParams: URLSearchParams = new URLSearchParams();
        if (params != null && params != undefined) {
            params.forEach((value: string, key: string) => {
                searchParams.set(key, value);
            });
        }

        console.log('URL:' + searchParams);

        return searchParams;
    }



    formatToLocalDateTime(datetime: Date) {

        let year = datetime.getFullYear() < 10 ? ("0" + datetime.getFullYear().toString()) : datetime.getFullYear();
        let month = ((datetime.getMonth() + 1) < 10) ? ("0" + (datetime.getMonth() + 1)) : (datetime.getMonth() + 1);

        let date = datetime.getDate() < 10 ? ("0" + datetime.getDate().toString()) : datetime.getDate();
        let hourStr = datetime.getHours() < 10 ? ("0" + datetime.getHours().toString()) : datetime.getHours();
        let minutesStr= datetime.getMinutes() < 10 ? ("0" + datetime.getMinutes().toString()) : datetime.getMinutes();

        let timeStr = `${hourStr}:${minutesStr}:00`;
        return `${year}-${month}-${date}T${timeStr}`;
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
}
