import {IMyDateModel} from 'mydatepicker';
import * as moment from 'moment';

export function getCurrentDate() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    return new Date(y, m, d);
}

export function getDate(date: Date) {
  var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  return new Date(y, m, d);
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
