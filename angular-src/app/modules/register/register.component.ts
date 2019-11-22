import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {Department, Register} from "../../shared/models/register";
import {Router} from "@angular/router";
import {doLogout} from "../../shared/utils";
import {AlertComponent} from "../../common/alert/alert.component";
import {TranslateService} from "@ngx-translate/core";
import {AuthGuard} from "../../shared/services/auth.service";
import {BadRequestResponse} from "../../shared/models/bad-request-response";
import {BlockUIService} from "../../shared/services/block-ui.service";
import {LogoutService} from "../../shared/services/logout-service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent extends DialogComponent<{ model: Register }, Register> implements OnInit {

    constructor(dialogService: DialogService,
                private router: Router,
                private translateService: TranslateService,
                private authGuard: AuthGuard,
                private blockUI: BlockUIService,
                private logoutService: LogoutService) {
        super(dialogService);

    }

    model: Register;

    ngOnInit(): void {
    }

    handleApplyAuthority(): void {
        this.postRequestAuthorization(this.model);
    }

    cancel() {
        this.result = null;
        this.close();
        if(this.model.isRegister) {
            doLogout(this.router, this.logoutService);
        }
    }

    public postRequestAuthorization(register: Register): void {
        //this.blockUI.start();
        this.authGuard.postRequestAuthorization(register).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    this.showInfoPopup();
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            this.blockUI.stop();
        });
    }

    handleChangeAuthority(): void{
        if(!this.model.isRegister && this.model.newDepartments.length > 0){

            let register: Register = new Register(this.model.username, this.model.fullName, null, this.model.version, null, null, null, this.model.userMemo);
            register.appliedToSystem = this.model.appliedToSystem;
            let requestedIds: string[] = this.model.newDepartments.filter(e=>{return e.selected == true}).map(e=>e.id);
            register.requestedCategories = requestedIds.join(";");
            register["used"] = "C";
            this.authGuard.postChangeAuthorization(register).subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.showErrorPopup(badRequestResponse.exceptionMsg);
                        this.blockUI.stop();
                        break;
                    }
                    case 'OK': {
                        this.showInfoPopup();
                    }
                    default:
                        this.blockUI.stop();
                }
            }, error => {
                this.blockUI.stop();
            });
        }
    }

    showErrorPopup(message: string) {
        this.dialogService.addDialog(AlertComponent, {
            title: 'Exception',
            message: message,

        }).subscribe(() => {
        });
    }

    showInfoPopup() : void{
        let title = this.translateService.instant("label.info");
        let msg = this.translateService.instant("login.userRequestMessage");

        this.dialogService.addDialog(AlertComponent, {
            title: title,
            message: msg,

        }).subscribe(() => {
            this.close();
            if(this.model.isRegister)
                doLogout(this.router, this.logoutService);
        });
    }

    selectDepartment(department: Department) :void {
        if(department.selected == false){
            department.selected = true;
        }
        else department.selected = false;
    }


}
