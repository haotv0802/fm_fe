import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import {EventExpenseService} from "./eventExpense.service";

@Injectable()
export class EventExpenseGuard implements CanActivate {

    constructor(
      private _router: Router,
      private _eventExpenseService: EventExpenseService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            // alert('Invalid expense Id');
            // start a new navigation to redirect to list page
            this._router.navigate(['/expenses']);
            // abort current navigation
            return false;
        }
        this._eventExpenseService.checkEventExpenses(id).subscribe(
          (res) => {
              console.log(res);
              if (res == true) {
                  return true;
              } else {
                this._router.navigate(['/expenses']);
                return false;
              }
          }, (error) => {
            console.log(error);
            this._router.navigate(['/expenses']);
            return false;
          }
        );
    }
}
