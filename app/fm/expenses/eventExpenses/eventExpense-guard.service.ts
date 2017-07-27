import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {HTTPService} from "../../../common/HTTP.service";
import {Observable} from "rxjs/Observable";
import {Constants} from "../../../common/constant";

@Injectable()
export class EventExpenseGuard implements CanActivate {

    constructor(
      private _router: Router,
      private _httpService: HTTPService,
      private _constants: Constants
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
        let id = +route.url[1].path;
        if (isNaN(id)) {
            // alert('Invalid expense Id');
            // start a new navigation to redirect to list page
            this._router.navigate(['/expenses']);
            // abort current navigation
            return false;
        }
        // return this._eventExpenseService.checkEventExpenses(id).subscribe(
        //   (res) => {
        //       console.log(res);
        //       if (res == false) {
        //         this._router.navigate(['/expenses']);
        //         return false;
        //       }
        //       return true;
        //   }, (error) => {
        //     console.log(error);
        //     this._router.navigate(['/expenses']);
        //     return false;
        //   }
        // );
      // return this._eventExpenseService.checkEventExpenses(id);
      if (id > 0) {
        return this._httpService.get(this._constants.EVENT_EXPENSES_SERVICE_URL + `/${id}/check`)
          .map((res) => {
            let isExisting = <boolean>res.json().isEventExisting;
            if (isExisting == false) {
              this._router.navigate(['/expenses']);
            }
            return isExisting;
          })
          // .do((res) => {console.log(res)})
          ;
      } else {
          return true;
      }
    }
}
