import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

import RouteUtils from '../../../shared/utils/RouteUtils';
import { isEmpty } from '../../../shared/utils';
import { Region } from '../models/region';

@Component({
    selector: 'region-edit',
    templateUrl: 'region-edit.component.html',
    styleUrls: ['region-edit.component.css']
})
export class RegionEditComponent extends DialogComponent<{ model: Region, departmentGroupMap: any }, Region> implements OnInit {

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    error: any = {};
    model: Region = new Region();
    departments: string[];
    groups: string[];
    departmentGroupMap: any = {};

    ngOnInit() {
        this.departments = Object.keys(this.departmentGroupMap);
        if (isEmpty(this.model.departName) && this.departments.length > 0) {
            this.model.departName = this.departments[0];
        }

        let groups = this.departmentGroupMap[this.model.departName];
        this.groups = groups ? groups : [];
    }

    handleSubmit() {
        if (!this.validate()) {
            return;
        }

        this.result = {
            ...this.model,
            departName: this.model.departName !== '' ? this.model.departName : this.model['_departName'],
            groupName: this.model.groupName !== '' ? this.model.groupName : this.model['_groupName']
        };


        this.close();
    }

    handleCancel() {
        this.result = null;
        this.close();
    }

    handleUsedChange(event) {
        this.model.used = event.target.value;
    }

    validate() {
        let model = this.model;
        this.error = {};

        // TODO: add more validator
        
        return isEmpty(this.error);
    }
}