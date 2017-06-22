import {Component} from '@angular/core';
import {LogoutService} from './logout.service';
import {Router} from '@angular/router';

@Component({
  template: ``
})
export class LogoutComponent {

  constructor(private _logoutService: LogoutService, private _router: Router) {
  }

  logout() {
    this._logoutService.logout();
    this._router.navigate(["welcome"]);
  }
}