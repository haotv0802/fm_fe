import {Component, ViewContainerRef} from '@angular/core';
import {RenewalOrganizationModel, Version} from "../../models/category";
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {CategoryManagementService} from "../../services/category-management-service";
import {BadRequestResponse} from "../../../../shared/models/bad-request-response";
import {TranslateService} from "@ngx-translate/core";
import {showErrorPopup} from "../../../../shared/utils";


export interface ModelForm {
    model: RenewalOrganizationModel;
}

@Component({
    selector: 'app-renewal-organization-popup',
    templateUrl: './renewal-organization-popup.component.html',
    styleUrls: ['./renewal-organization-popup.component.css']
})
export class RenewalOrganizationPopupComponent extends DialogComponent<ModelForm, boolean> implements ModelForm {

    model: RenewalOrganizationModel;

    error: string = "";

    constructor(dialogService: DialogService,
                public blockUI: BlockUIService,
                public catetogyManagemenetService: CategoryManagementService,
                public viewContainerRef: ViewContainerRef,
                private translateService: TranslateService) {
        super(dialogService);
        this.blockUI.vRef = this.viewContainerRef;
    }

    handleRenewalOrganization(): void {
        console.log("save renewal");
        let version = new Version(this.model.versionCode, this.model.versionName);
        this.postRenewalOrganization(version);
    }

    postRenewalOrganization(version: Version): void {

        this.blockUI.start();
        this.catetogyManagemenetService.postRenewalOrganization(version).subscribe(response => {
            switch (response.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = response as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    this.blockUI.stop();
                    this.close();
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            console.log('Create Organization Error: ', error);
            this.blockUI.stop();
            let errorMessage = this.translateService.instant("message.err_unknown");
            showErrorPopup(this.dialogService, this.translateService, errorMessage);
        });


    }


    validateVersionCode(): void {
        let regex = new RegExp("(\\d{4})(\\d{2})(\\d{2})");
        let btnButton = document.getElementById("btnSave");
        let errorMessage = this.translateService.instant("message.error_versionCode");
        if (this.model.versionCode == "" || !regex.test(this.model.versionCode)) {
            this.error = errorMessage;
            btnButton.setAttribute("disabled", "disabled");
        }
        else {
            this.error = "";
            btnButton.removeAttribute("disabled");
        }
    }

}
