import {BaseModel} from "../../../../shared/models/base-model";

export class Notification {
    public srl?: string;
    public pageId: string;
    public pageName?: string;
    public status?: string;
    public content?: string;
    public startDate?: string;
    public endDate?: string;
    public updatedAt?: string;
    public updatedId?: string;
    public isChecked?: boolean = false;
    public createdAt?: string;
    public createdId?: string;
    public contentWithoutTag?: string;
}

export class  NotificationFilter extends BaseModel {
    status: string;
    content: string;

    /**
     * setting default value
     */
    constructor() {
        super();
    }

    getPropValue(prop) {
        return super.getPropValue(prop);
    }

    setPropValue(prop: any, value: any) {
        super.setPropValue(prop, value);
    }
}