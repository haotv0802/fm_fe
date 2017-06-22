import {Injectable} from '@angular/core';

@Injectable()
export class LogoutService {

  logout() {
    console.log('set nullllll')
    sessionStorage.setItem("authority", null);
    sessionStorage.setItem("authToken", null);
  }

}