import {CanActivate, Router, ActivatedRouteSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {IndividualUpdateService} from "./individualUpdate.service";

@Injectable()
export class IndividualUpdateGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _individualUpdateService: IndividualUpdateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this._individualUpdateService.individual) {
      this._router.navigate(["admin/individuals"]);
      return false;
    }
    return true;
  }
}