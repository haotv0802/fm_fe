import {Component} from '@angular/core';
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {RegisterComponent} from "../register/register.component";
import {BlockUIService} from "../../shared/services/block-ui.service";
import {Register} from "../../shared/models/register";
import {Router} from "@angular/router";
import {doLogout} from "../../shared/utils";
import {LogoutService} from "../../shared/services/logout-service";

export interface ConfirmModel {
    title: string;
    message: string;
    model: Register;
}

@Component({
    selector: 'app-register-confirm',
    moduleId: module.id,
    templateUrl: './register-confirm.component.html',
    styleUrls: ['./register-confirm.component.css']
})

export class RegisterConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {

    title: string;
    message: string;
    model: Register;

    constructor(dialogService: DialogService,
                private blockUI: BlockUIService,
                private router: Router,
                private logoutService: LogoutService) {
        super(dialogService);
    }

    confirm() {
        // on click on confirm button we set dialog result as true,
        // ten we can get dialog result from caller code
        this.showRegisterPopup(this.model);
        this.result = true;
        this.close();
    }

    cancel() {
        this.result = false;
        this.close();
        doLogout(this.router, this.logoutService);
    }

    showRegisterPopup(model): void {
        let params = {
            model: {...model}
        };
        this.dialogService.addDialog(RegisterComponent, params).subscribe(model => {
            if (model) {
                this.blockUI.start();
            }
        });
    }



}
