import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {TranslateService} from "@ngx-translate/core";

export interface AlertModel {
    title: string;
    message: string;
}

@Component({
    selector: 'alert-component',
    moduleId: module.id,
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.css']
})
export class AlertComponent extends DialogComponent<AlertModel, null> implements AlertModel {

    title: string;

    message: string;

    constructor(dialogService: DialogService,
                translateService: TranslateService) {
        super(dialogService);
    }


}
