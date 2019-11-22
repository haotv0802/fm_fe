import {Component, ViewContainerRef} from '@angular/core';
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {CreateOrgTeamFormModel, Organization, OrganizationType, ParentOrganization} from "../../models/category";
import {CategoryManagementService} from "../../services/category-management-service";
import {BadRequestResponse} from "../../../../shared/models/bad-request-response";
import {AlertComponent} from "../../../../common/alert/alert.component";
import {Router} from "@angular/router";
import RouteUtils from "../../../../shared/utils/RouteUtils";
import {TranslateService} from "@ngx-translate/core";
import {showErrorPopup} from "../../../../shared/utils";

export interface ModelForm {
    //model: Organization;
    model: CreateOrgTeamFormModel
}

@Component({
    selector: 'app-create-category-popup',
    templateUrl: './create-category-popup.component.html',
    styleUrls: ['./create-category-popup.component.css']
})
export class CreateCategoryPopupComponent extends DialogComponent<ModelForm, boolean> implements ModelForm {

    //model: Organization;
    model: CreateOrgTeamFormModel;
    orgType: OrganizationType = OrganizationType.Org;
    teamType: OrganizationType = OrganizationType.Team;

    constructor(dialogService: DialogService,
                public blockUI: BlockUIService,
                public catetogyManagemenetService: CategoryManagementService,
                public viewContainerRef: ViewContainerRef,
                private router: Router,
                private translateService: TranslateService,) {
        super(dialogService);
        this.blockUI.vRef = this.viewContainerRef;
    }

    errorOrgName: string = '';
    errorTeamName: string = '';

    handleRadioOrganizationChange(event): void {

        let organization = this.model.organization;

        if (event.target.value == 'Org') {
            organization.type = OrganizationType.Org;
            organization.orgCode = null;
            this.clearErrorMsgs();
        } else {
            organization.type = OrganizationType.Team;
            organization.orgCode = organization.parentOrganizations[0].code;
            this.clearErrorMsgs();
        }
    }

    handleSaveCreateOrganization(): void {

        if(this.errorTeamName != "" || this.errorOrgName != "")
            return;

        let orgBody: ParentOrganization;
        let teamBody: Organization;

        let organization = this.model.organization;

        if (organization.type == OrganizationType.Org) {

            if(organization.orgName == "" || organization.orgName == undefined)
                return;

            orgBody = new ParentOrganization(organization.orgCode, organization.orgName);
            orgBody.versionName = organization.versionName;
            orgBody.versionCode = organization.versionCode;
        } else {
            if(organization.teamName == "" || organization.teamName == undefined)
                return;
            teamBody = new Organization(organization.orgCode, organization.orgName, organization.teamCode, organization.teamName);
            teamBody.versionCode = organization.versionCode;
            teamBody.versionName = organization.versionName;
        }


        this.blockUI.start();
        this.catetogyManagemenetService.postCreateOrganizationOrTeam(organization.type, orgBody, teamBody).subscribe(response => {
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
                    window.location.reload(true);
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            this.blockUI.stop();
            let errorMessage = this.translateService.instant("message.err_unknown");
            showErrorPopup(this.dialogService, this.translateService, errorMessage);
        });


    }

    validateInputValue(value, type) : void{
        if(value != null) {
            let btnButton = document.getElementById("btnSave");
            let OrgTeamArray = this.model.orgTeamNameArray;
            if (OrgTeamArray.indexOf(value.toLowerCase()) > -1) {
                let errorMsg = this.translateService.instant("message.error_name_exist");
                if (type == OrganizationType.Org) {
                    this.errorOrgName = errorMsg;
                    btnButton.setAttribute("disabled", "disabled");
                }
                else {
                    this.errorTeamName = errorMsg;
                    btnButton.setAttribute("disabled", "disabled");
                }
            }
            else {
                this.clearErrorMsgs();
            }
        }
    }

    clearErrorMsgs() : void{
        this.errorTeamName = "";
        this.errorOrgName = "";
        let btnButton = document.getElementById("btnSave");
        btnButton.removeAttribute("disabled");
    }
}
