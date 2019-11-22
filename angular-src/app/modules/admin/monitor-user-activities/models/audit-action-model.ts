import {IMyDateModel} from "mydatepicker";
import {BaseModel} from "../../../../shared/models/base-model";
import {createIMyDateModel, getCurrentDate, getFirstDateOfMonth} from "../../../../shared/utils";
import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";
import {AuditActionDto} from "./audit-action-dto";

export class AuditActionFilter extends BaseModel {
    fromDateTime: IMyDateModel;
    hourAtStartDate: string;

    toDateTime: IMyDateModel;
    hourAtEndDate: string;

    teamId: string;
    menuItem: string;
    userId:string;
    searchUserId:string;
    searchUserName:string;

    isShowDetails: boolean;
    isShowAnalysis: boolean;

    typeSearch:string;
    graphSearch:string;

    constructor() {
        super();
        this.fromDateTime = createIMyDateModel(getFirstDateOfMonth());
        this.hourAtStartDate ='';

        this.toDateTime = createIMyDateModel(getCurrentDate());
        this.hourAtEndDate ='';
        this.teamId = '';
        this.userId = '';
        this.searchUserId = '';
        this.searchUserName = '';
        this.isShowDetails = false;
        this.isShowAnalysis = false;
    }

    getPropValue(prop) {
        if (prop === 'searchDate') {
            return this.fromDateTime.formatted;

        }

        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
        if (prop === 'searchDate') {
            this[prop] = createIMyDateModel(new Date(value));
        } else {
            super.setPropValue(prop, value);
        }
    }

}

