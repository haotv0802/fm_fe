import { Component }          from '@angular/core';
import {  Router}  from '@angular/router';
import {doLogout} from "../../shared/utils";
import {LogoutService} from "../../shared/services/logout-service";

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
})

export class AdminComponent {
    constructor(
        private router: Router,
        private logoutService: LogoutService) {
        this.role = window.localStorage.getItem('role');

        if(this.role != 'admin')
            doLogout(this.router, this.logoutService);

    }

    role: string;

    ngOnInit() {
         
    }
}

