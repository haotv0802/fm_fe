import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {AlertComponent} from "../../../common/alert/alert.component";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "ng2-bootstrap-modal";
import {CategoryManagementService} from "../services/category-management-service";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import {
    CreateOrgTeamFormModel,
    Organization, OrganizationRequest, OrganizationType, ParentOrganization, RenewalOrganizationModel,
    Version
} from "../models/category";
import {CreateCategoryPopupComponent} from "./create-category-popup/create-category-popup.component";
import {TranslateService} from "@ngx-translate/core";
import {ModalService} from "../../../shared/services/modal.service";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {RenewalOrganizationPopupComponent} from "./renewal-organization-popup/renewal-organization-popup.component";
import {showErrorPopup} from "../../../shared/utils";

const CATEGORY_CHANGE_MODE_URL = "admin/category-change-mode";

@Component({
    selector: 'app-category-management',
    templateUrl: './category-management.component.html',
    styleUrls: ['./category-management.component.css']
})

export class CategoryManagementComponent implements OnInit {

    organizationsAndTeams: Organization[];
    parentOrganizations: ParentOrganization[];
    version: Version;
    organizationAndTeamsNameArray: string[] = [];

    onChangeMode: boolean = false;

    organizationsAndTeamsCached: Organization[];

    constructor(private catetogyManagemenetService: CategoryManagementService,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService,
                private dialogService: DialogService,
                private viewContainerRef: ViewContainerRef,
                private translateService: TranslateService) {

        this.blockUI.vRef = this.viewContainerRef;


        this.onFindAllOrganizationTeam();
    }
    ngOnInit() {
    }

    onFindAllOrganizationTeam() {
        this.blockUI.start();
        this.catetogyManagemenetService.getAllOrganizationAndTeam().subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let response = serverResponse;
                    let apiData = response.data as OrganizationRequest;
                    this.organizationsAndTeams = apiData.organizationsAndTeams;
                    this.parentOrganizations = apiData.organizations;
                    this.version = new Version(apiData.versionCode, apiData.versionName);
                    this.organizationsAndTeamsCached = JSON.parse(JSON.stringify(apiData.organizationsAndTeams));
                    this.getorganizationAndTeamsNameArray();
                    this.blockUI.stop();

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



    getorganizationAndTeamsNameArray() : void{
        this.organizationsAndTeams.forEach(e => {
            if(e.teamName != undefined)
                this.organizationAndTeamsNameArray.push(e.teamName.toLowerCase());
        });
        this.parentOrganizations.forEach(value => {
            if(value.name != undefined)
                this.organizationAndTeamsNameArray.push(value.name.toLowerCase());
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

        this.onChangeMode = true;

    }

    showDialogPopup(model): void {
        this.dialogService.addDialog(CreateCategoryPopupComponent, {
            model: model
        }).subscribe(() => {
        });
    }

    handleRevewalOrganization(event): void {
        let version = new Version();
        let model = new RenewalOrganizationModel(this.version);
        model.currentVersion = this.version.versionName;
        this.dialogService.addDialog(RenewalOrganizationPopupComponent, {model}).subscribe(() => {});
    }

    handleCancel() : void{
        this.onChangeMode = false;
        this.organizationsAndTeams = JSON.parse(JSON.stringify(this.organizationsAndTeamsCached));
    }


}
