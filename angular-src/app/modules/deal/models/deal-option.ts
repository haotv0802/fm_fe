import {HttpStatus, ServerResponse} from "../../../shared/models/server-response";

export class DealOption {
    constructor(public srl?: string,
                public corpDealSrl?: string,
                public corpId?: string,
                public dealId?: string,
                public instantId?: string,
                public optionId?: string,
                public corpDealId?: string,
                public sellCount?: string,
                public originPrice?: string,
                public curPrice?: string,
                public maxCount?: string,
                public title?: string,
                public desc?: string,
                public isInstant?: string,
                public ignored?: string,
                public rawSrl?: string) {
    };
}