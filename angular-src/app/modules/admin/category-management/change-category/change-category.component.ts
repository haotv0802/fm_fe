import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {CategoryManagementService} from "../../services/category-management-service";
import {AlertComponent} from "../../../../common/alert/alert.component";
import {DialogService} from "ng2-bootstrap-modal";
import {CreateCategoryPopupComponent} from "../create-category-popup/create-category-popup.component";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ModalService} from "../../../../shared/services/modal.service";
import {
    CreateOrgTeamFormModel, Organization, OrganizationType, ParentOrganization,
    Version
} from "../../models/category";
import RouteUtils from "../../../../shared/utils/RouteUtils";
import {BadRequestResponse} from "../../../../shared/models/bad-request-response";
import {showErrorPopup} from "../../../../shared/utils";

const URL_CATEGORY_MANAGEMENT = "admin/category-management";

@Component({
  selector: 'app-change-category',
  templateUrl: './change-category.component.html',
  styleUrls: ['./change-category.component.css']
})
export class ChangeCategoryComponent implements OnInit {

    @Input('organizationsAndTeams')
    public organizationsAndTeams: Organization[];

    @Input('parentOrganizations')
    public parentOrganizations: ParentOrganization[];

    @Input('version')
    public version: Version;

    @Input('organizationAndTeamsNameArray')
    public organizationAndTeamsNameArray: string[];

    @Output('onCancel')
    public onCancel: EventEmitter<any> = new EventEmitter();

    used: any =  ["Y", "N"];
    orgCodeAndNameMap = {};
    teamCodeNameMap = {};

    constructor(private catetogyManagemenetService: CategoryManagementService,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService,
                private dialogService: DialogService,
                private viewContainerRef: ViewContainerRef,
                private translateService: TranslateService,
                private modalService: ModalService) {

        this.blockUI.vRef = this.viewContainerRef;

    }

    ngOnInit() {

        this.parentOrganizations.forEach(e => {
            if(e.name != null) {
                this.orgCodeAndNameMap[e.code] = e.name.toLowerCase();
                this.teamCodeNameMap[e.code] = e.name.toLowerCase();
            }

        });

        this.organizationsAndTeams.forEach(e => {
            if(e.teamName != null)
                this.teamCodeNameMap[e.teamCode] = e.teamName.toLowerCase();
        });

    }

    onCheckOrganizationMapping(organization: Organization) {
        this.blockUI.start();
        this.catetogyManagemenetService.postCheckOrganizationMapping(organization).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showAlertPopup(badRequestResponse.exceptionMsg, "Exception");
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let data = serverResponse.data;
                    this.blockUI.stop();
                    if(data === true){
                        this.showAlertPopupWhenOrganizationMapped(organization);

                    }
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


    showAlertPopup(message: string, title: string) {
        this.dialogService.addDialog(AlertComponent, {
            title: title,
            message: message,

        }).subscribe(() => {
        });
    }

    handleCreateNewBtn(event): void {
        let organization = new Organization();
        organization.type = OrganizationType.Org;
        organization.parentOrganizations = this.parentOrganizations;
        organization.versionName = this.version.versionName;
        organization.versionCode = this.version.versionCode;
        let model = new CreateOrgTeamFormModel(organization, this.organizationAndTeamsNameArray);
        this.showDialogPopup(model);
    }

    handleModifyModeBtn(event): void {
        this.modalService.showConfirm(this.translateService.instant("admin.category.runToChangeConfirmMessage"), ()=>{
            this.updateOrganizationChanges(this.organizationsAndTeams);
        });
    }

    handleCancelBtn(event): void {
        this.onCancel.emit();

    }

    showDialogPopup(model): void {
        this.dialogService.addDialog(CreateCategoryPopupComponent, {
            model: model
        }).subscribe(() => {
        });
    }


    handleUsedChange(event, org): void{
        if(org.used == 'N')
            this.onCheckOrganizationMapping(org);
    }
    showAlertPopupWhenOrganizationMapped(org: Organization) : void {
        this.dialogService.addDialog(AlertComponent, {
            title: this.translateService.instant("label.alert"),
            message: this.translateService.instant("admin.category.exposureYNAlertMessage"),
        }).subscribe(() => {
            org.used = 'Y';
        });
    }

    handleOrganizationChange(event, org) : void {
        let orgCode = event.target.value;
        org.orgName = this.orgCodeAndNameMap[orgCode];
        org.orgCode = Number(orgCode);

    }

    public updateOrganizationChanges(organizations: Organization[]): void {
        this.blockUI.start();
        this.catetogyManagemenetService.postUpdateAllOrganizationChanges(organizations).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    this.blockUI.stop();
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

    validateInputValue(org) : void{
        if(org.teamName != null || org.orgName !=  null) {
            let errorElement = document.getElementById("error_"+org.teamCode);
            let btnButton = document.getElementById("btnModify");

            let errorMsg = this.translateService.instant("message.error_name_exist");
            if(errorElement == null){
                errorElement = document.getElementById("error_"+org.orgCode);
            }
            if (org.teamName != null && this.organizationAndTeamsNameArray.indexOf(org.teamName.toLowerCase()) > -1 && this.teamCodeNameMap[org.teamCode] != org.teamName.toLowerCase()) {
                errorElement.innerText = errorMsg;
                btnButton.setAttribute("disabled", "disabled");
            } else if(org.orgName !=  null && this.organizationAndTeamsNameArray.indexOf(org.orgName.toLowerCase()) > -1 && this.teamCodeNameMap[org.orgCode] != org.orgName.toLowerCase()){
                errorElement.innerText = errorMsg;
                btnButton.setAttribute("disabled", "disabled");
            }
            else {
                errorElement.innerText = "";
                btnButton.removeAttribute("disabled");
            }
        }
    }




}
