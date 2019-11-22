import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {CookieService} from "ngx-cookie";

@Injectable()
export class NaverSearchGuard implements CanActivate {

    constructor(private router: Router, private cookieService: CookieService) {
    }
    canActivate() {
        if (!this.cookieService.get("pageAuthorities")) {
            return true;
        }
        let pageAuthorities = JSON.parse(this.cookieService.get("pageAuthorities"));

        let pageAuthority = pageAuthorities.find((item) => item.pageUrl === '/naver-search');
        if (pageAuthority) {
            return true;
        }
        return false;
    }
}