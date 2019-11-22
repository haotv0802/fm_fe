import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {LanguageService} from '../../shared/services/language.service';
import {LoginService} from '../../shared/services/login.service';
import {Login} from '../../shared/models/login';
import {CookieService} from "ngx-cookie";

@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent {

    username: string = '';
    password: string = '';
    hasError: boolean = false;

    constructor(private router: Router,
                private languageService : LanguageService,
                private loginService: LoginService,
                private cookieService: CookieService) {

        this.languageService.getLanguage();
    }

    ngOnInit() {
    }

    doLogin(): void {
        this.hasError = false;
        this.loginService.login(new Login(this.username, this.password)).subscribe((status) => {
            if (status == true) {
                window.localStorage.setItem('authenticated', 'true');
                window.localStorage.setItem('username', this.username);
                window.localStorage.setItem('password', this.password);
                this.cookieService.put('user-login', 'OK');
                this.router.navigate(['/']);
            }
            else {
                this.hasError = true;
            }

        });
    }
}
