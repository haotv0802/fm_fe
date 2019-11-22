import {createIMyDateModel, getFirstDateOfMonth, getLastDateOfMonth} from "../../../shared/utils";
import {BaseModel} from "../../../shared/models/base-model";
import {IMyDateModel} from "mydatepicker";

export class OptionSummary {
    constructor(public date: string,
                public competitor: string,
                public category: string,
                public dealNumber: string,
                public dealName: string,
                public optionNumber: string,
                public optionTitle: string,
                public price: string,
                public sellCount: string,
                public sales: string,
                public sellStartTime: string,
                public sellEndTime: string
    ) {
    }
}

export class  OptionSummaryFilter extends BaseModel {
    startDate: IMyDateModel;
    endDate: IMyDateModel;
    competitor: string;
    category: string;
    search: string;
    hideStartEndDate: boolean;
    type: string;

    /**
     * setting default value
     */
    constructor() {
        super();
        this.competitor = "tmn";
        this.category = "-1";
        this.search = "";
        this.hideStartEndDate = false;
        this.type = "option";
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

    getIgnoreProps() {
        return ['viewCorrected'];
    }
}