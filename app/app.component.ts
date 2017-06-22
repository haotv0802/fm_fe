import {Component, OnInit} from "@angular/core";
import {ToasterService} from "angular2-toaster";
import {MessagesService} from "./common/messages/messages.service";

@Component({
    selector: 'ht-app',
    // template: `
    // <div>
    //     <nav class='navbar navbar-default'>
    //         <div class='container-fluid'>
    //             <a class='navbar-brand'>{{pageTitle}}</a>
    //             <ul class='nav navbar-nav'>
    //                 <li><a [routerLink]="['/welcome']">Home</a></li>
    //                 <li><a [routerLink]="['/login']">Login</a></li>
    //                 <li><a [routerLink]="['/products']">Product List</a></li>
    //             </ul>
    //         </div>
    //     </nav>
    //     <div class='container'>
    //         <router-outlet></router-outlet>
    //     </div>
    //  </div>
    //  `
    templateUrl: 'app/app.component.html'
})

export class AppComponent implements OnInit {

    // pageTitle: string = 'Acme Product Management';
    toastList: Array<any> = new Array();
    toastIndex: number = 0;

    constructor(
      private _toasterService: ToasterService,
      private _messagesService: MessagesService
    ) {
    }

    ngOnInit(): void {
        this._messagesService.getCommonMessages();
    }

    popToast() {
        let toast = this._toasterService.pop('success', 'Args Title', 'Args Body');
        this.toastList.push(toast);
    }
    clearToast() {
        for (let i = 0; i < this.toastList.length; i++) {
            this._toasterService.clear(this.toastList[i].toastId, this.toastList[i].toastContainerId);
        }
    }
}
