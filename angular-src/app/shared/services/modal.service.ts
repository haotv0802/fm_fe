import {Injectable} from "@angular/core";
import {DialogService} from "ng2-bootstrap-modal";
import {AlertComponent} from "../../common/alert/alert.component";
import {ConfirmComponent} from "../../common/confirm/confirm.component";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class ModalService {

    constructor(private dialogService: DialogService, private translateService: TranslateService,) {

    }

    showAlert(message: string, title?: string) {
        let translatedTitle = this.translateService.instant("label.alert");
        this.dialogService.addDialog(AlertComponent,
            {title: title == undefined ? translatedTitle : title, message: message})
    }

    showConfirm(message: string, callBack: () => void, title?: string): any {
        let translatedTitle = this.translateService.instant("label.confirmation");
        return this.dialogService.addDialog(ConfirmComponent, {
            title: title == undefined ? translatedTitle : title,
            message: message})
            .subscribe((isConfirmed) => {
                //Get dialog result
                if(isConfirmed) {
                    callBack();
                }
            });
    }
}