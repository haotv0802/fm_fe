import {IMyDateModel} from 'mydatepicker';
import * as moment from 'moment';
import {Router} from "@angular/router";
import {DialogService} from "ng2-bootstrap-modal";
import {AlertComponent} from "../../common/alert/alert.component";
import {TranslateService} from "@ngx-translate/core";
import {LogoutService} from "../services/logout-service";

export function getFirstDateOfMonth() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    return new Date(y, m, 1);
}

export function getCurrentDate(){
    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    return new Date(y, m, d);
}

export function getLastDateOfMonth() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    return new Date(y, m + 1, 0);
}

export function createIMyDateModel(jsdate: Date): IMyDateModel {
    return {
        date: {
            year: jsdate.getFullYear(),
            month: jsdate.getMonth() + 1,
            day: jsdate.getDate()
        },
        jsdate: jsdate,
        epoc: Math.floor(jsdate.getTime() / 1000),
        formatted: moment(jsdate).format('YYYY-MM-DD')
    }
}

export function get(obj: object, key: string, defaultVal?: any) {
    let keys = key.split('.');
    let target = obj;
    for (let k = 0; k < keys.length; k++) {
        target = target[keys[k]];
        if (target == undefined) {
            break;
        }
    }

    return target != undefined ? target : defaultVal;
}

export function set(obj: object, key: string, val: any) {
    let keys = key.split('.');
    let target = obj;
    for (let k = 0; k < keys.length - 1; k++) {
        let _key = keys[k];
        if (target[_key] == undefined) {
            target[_key] = {};
        }
        target = target[_key];
    }

    target[keys[keys.length - 1]] = val;
}

export function formatNumber(val: number, decimals?: number): string {
    decimals = decimals ? decimals : 0;
    var parts = val.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

export function formatDate(val: Date) {
    return moment(val).format('YYYY-MM-DD');
}

export function formatTime(val: Date) {
    return moment(val).format('hh:mm:ss');
}

export function formatDateTime(val: Date) {
    return moment(val).format('YYYY-MM-DD hh:mm:ss');
}

export function formatPercent(val: number, char?: string) {
    return formatNumber(val, 0) + (char ? char : '%');
}

export function isNull(value) {
    return value === null || value === undefined;
}

export function isEmpty(value) {
    if (value === null || value === undefined || value.length === 0
        || (Object.keys(value).length === 0 && value.constructor === Object)) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    return false;
}

export function doLogout(router: Router, logoutService: LogoutService): void {
    logoutService.logout().subscribe(() => {});
    window.localStorage.removeItem('authenticated');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("assignedCategories");
    window.localStorage.removeItem("authorityInfo");
    router.navigate(['/login']);
}

export function showErrorPopup(dialogService: DialogService, translateService: TranslateService, message: string) {
    let title = translateService.instant("label.error")
    let msg = translateService.instant(message)
    dialogService.addDialog(AlertComponent, {
        title: title,
        message: msg,
    }).subscribe(() => {
    });
}