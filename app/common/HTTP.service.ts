///<reference path="../../node_modules/@angular/http/src/http.d.ts"/>
import {Injectable} from "@angular/core";
import {Constants} from "./constant";
import {Observable} from "rxjs/Observable";
import {Headers, Http, RequestOptions, Response, URLSearchParams} from "@angular/http";

@Injectable()
export class HTTPService {

  constructor(
    private _http: Http,
    private _constants: Constants,
  ) {
  }

  public post(url: string, data: any): Observable<Response> {
    let headers = new Headers();
    headers.append("Accept-Language", this.getAcceptLanguage());
    headers.append("Content-Type", "application/json");
    if (url != this._constants.LOGIN_SERVICE_URL) {
      headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
    }
    return this._http.post(url, data, {headers: headers})
      // .catch(this.handleError)
      ;
  }

  public patch(url: string, data?: any): Observable<Response> {
    let headers = new Headers();
    headers.append("Accept-Language", this.getAcceptLanguage());
    headers.append("Content-Type", "application/json");
    if (url != this._constants.LOGIN_SERVICE_URL) {
      headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
    }
    return this._http.patch(url, data, {headers: headers})
      // .catch(this.handleError)
      ;
  }

  public delete(url: string): Observable<Response> {
    let headers = new Headers();
    headers.append("Accept-Language", this.getAcceptLanguage());
    headers.append("Content-Type", "application/json");
    if (url != this._constants.LOGIN_SERVICE_URL) {
      headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
    }
    return this._http.delete(url, {headers: headers})
      // .catch(this.handleError)
      ;
  }

  public postImageFile(url: string, data: any): Observable<Response> {
    let headers = new Headers();
    headers.append("Accept-Language", this.getAcceptLanguage());
    // headers.append("Content-Type", "multipart/form-data");
    headers.append('Accept', 'application/json');
    if (url != this._constants.LOGIN_SERVICE_URL) {
      headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
    }
    return this._http.post(url, data, {headers: headers})
      // .catch(this.handleError)
      ;
  }

  public get(url: string, params?: URLSearchParams): Observable<Response> {
    let headers = new Headers();
    headers.append("Accept-Language", this.getAcceptLanguage());
    headers.append("Content-Type", "application/json");
    if (url != this._constants.LOGIN_SERVICE_URL) {
      headers.append(this._constants.X_AUTH_TOKEN_HEADER, sessionStorage.getItem(this._constants.AUTH_TOKEN));
    }
    let requestOptions: RequestOptions = new RequestOptions();
    requestOptions.headers = headers;
    requestOptions.params = params;
    return this._http.get(url, requestOptions)
      .catch(this.handleError)
    ;
  }

  private handleError(error: Response) {
    console.error("Error logged in HTTPService: ");
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  private getAcceptLanguage(): string {
    // console.log("language: ");
    // console.log(navigator.language);
    //
    // let strings: string[] = navigator.language.split('-');
    // if (strings.length == 2) {
    //   console.log("Accept Language: " + strings[0]);
    //   return strings[0];
    // } else if (strings.length == 1) {
    //   return strings[0];
    // }
    // else {
    //   return "";
    // }

    // console.log("this._constants.LANGUAGE: " + this._constants.LANGUAGE);
    return this._constants.LANGUAGE;
  }
}