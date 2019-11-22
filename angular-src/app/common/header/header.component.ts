import { Component }          from '@angular/core';
import {  Router}  from '@angular/router';

@Component({
    selector: 'tmon-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    constructor(
        private router: Router) { }

}

