import {HttpStatus, ServerResponse} from "../../../shared/models/server-response";
import {IMyDateModel} from "mydatepicker";
import {createIMyDateModel, getFirstDateOfMonth, getLastDateOfMonth} from "../../../shared/utils";
import {BaseModel} from "../../../shared/models/base-model";

export class KeywordStatus {
    constructor(public no: number,
                public keywordName: string,
                public ticketmonster: number,
                public coupang: number,
                public wemakeprice: number,
                public details: KeywordDetails[]) {
    }
}

export class KeywordDetails {
    constructor(public optionName: string,
                public ticketmonster: number,
                public coupang: number,
                public wemakeprice: number) {
    }
}

export class KeywordStatusDetails {
    constructor(public keywordName: string,
                public optionName: string,
                public category: string,
                public dealNumber: string,
                public dealTitle: string,
                public optionNumber: string,
                public optionTitle: string) {
    }
}

export class SmartKeyword {
    constructor(public srl: string,
                public competitor: string,
                public category: string,
                public instantId: number,
                public dealNumber: string,
                public dealTitle: string,
                public smartKeyword: string,
                public optionNumber: string,
                public optionTitle: string,
                public sellStartTime: string,
                public sellEndTime: string,
                public confirm: boolean
    ) {
    }
}

export class KeywordStatusResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: KeywordStatus[];

}

export class  KeywordSummaryFilter extends BaseModel {
    startDate: IMyDateModel;
    endDate: IMyDateModel;
    keyword: string;

    /**
     * setting default value
     */
    constructor() {
        super();
        this.keyword = "";
        this.startDate = createIMyDateModel(getFirstDateOfMonth());
        this.endDate = createIMyDateModel(getLastDateOfMonth());
    }

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

export class  SmartKeywordFilter extends BaseModel {
    startDate: IMyDateModel;
    endDate: IMyDateModel;
    category: string;
    search: string;
    type: string;
    optionCheck: boolean;
    dealCheck: boolean;
    confirmKeyword: string;

    /**
     * setting default value
     */
    constructor() {
        super();
        this.category = "-1";
        this.search = "";
        this.type = "option";
        this.startDate = createIMyDateModel(getFirstDateOfMonth());
        this.endDate = createIMyDateModel(getLastDateOfMonth());
        this.optionCheck = false;
        this.dealCheck = true;
        this.confirmKeyword = "";
    }

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