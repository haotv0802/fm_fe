import {IMyDateModel} from "mydatepicker";
import {BaseModel} from "../../../../../shared/models/base-model";
import {createIMyDateModel, getCurrentDate} from "../../../../../shared/utils";
import {NotificationFilter} from "../../models/Notification";

export class NotificationCreation extends BaseModel{
    public srl?: string;
    public pageName?: string;
    public pageId?: string;
    public pageSummary: boolean;
    public pageDealDetail: boolean;
    public pageNaver: boolean;
    public pageGR: boolean;
    public pagePriceComparision: boolean;
    public pageBestOptions: boolean;

    public content?: string;
    public startDate?: IMyDateModel;
    public endDate?: IMyDateModel;
    public updatedDate?: string;
    public updater?: string;
    public hourAtStartDate?: string;
    public minuteAtStartDate?: string;
    public hourAtEndDate?: string;
    public minuteAtEndDate?: string;
    public currentURL?: string;
    public notificationFilter?: NotificationFilter;

    constructor(
    ){
        super();
        this.srl = null;
        this.pageName = '';
        this.pageId = '';
        this.content = '';
        this.startDate = createIMyDateModel(getCurrentDate());
        this.hourAtStartDate = '';
        this.minuteAtStartDate = '';
        this.endDate = createIMyDateModel(getCurrentDate());
        this.hourAtEndDate = '';
        this.minuteAtEndDate = '';
        this.updatedDate = '';
        this.updater = '';

        this.pageSummary = false;
        this.pageDealDetail = false;
        this.pageNaver = false;
        this.pageGR = false;
        this.pagePriceComparision = false;
        this.pageBestOptions = false;
        this.currentURL = '';
        this.notificationFilter = undefined;
    };

    getPropValue(prop) {
        if (prop === 'startDate') {
            return this.startDate.formatted;

        } else if (prop === 'endDate') {
            return this.endDate.formatted;
        }

        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
        if (prop === 'startDate' || prop === 'endDate') {
            this[prop] = createIMyDateModel(new Date(value));
        } else {
            super.setPropValue(prop, value);
        }
    }
}