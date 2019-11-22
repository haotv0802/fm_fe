import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

import RouteUtils from '../../../shared/utils/RouteUtils';
import { isEmpty } from '../../../shared/utils';
import { Area } from '../models/area';

@Component({
    selector: 'area-edit',
    templateUrl: 'area-edit.component.html',
    styleUrls: ['area-edit.component.css']
})
export class AreaEditComponent extends DialogComponent<{ model: Area, departmentMap: any }, Area> implements OnInit {

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    error: any = {};
    model: Area = new Area();
    departments: string[];
    regions: any[];
    departmentMap: any = {};

    ngOnInit() {
        this.departments = Object.keys(this.departmentMap);
        if (isEmpty(this.model.departName)) {
            this.model.departName = this.departments[0];
        }

        this.regions = this.departmentMap[this.model.departName];
        if (isEmpty(this.model.regionNo)) {
            this.model.regionNo = this.regions[0].regionNo;
        }
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

    handleDepartChange(event) {
        let val = event.target.value;
        this.model.departName = val;
        
        this.regions = this.departmentMap[val];
        this.model.regionNo = this.regions[0].regionNo;
    }

    validate() {
        let model = this.model;
        this.error = {};

        // TODO: add more validator
        
        return isEmpty(this.error);
    }
}