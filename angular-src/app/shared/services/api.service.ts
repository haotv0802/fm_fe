import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams, ResponseContentType} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import {CookieService} from "ngx-cookie";
import {ApplicationConstants} from "../../constant/application-constants";
import * as FileSaver from 'file-saver';
@Injectable()
export class ApiService {

    // static readonly headers = new Headers({
    //     'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    // });
    // static readonly options = new RequestOptions({headers: ApiService.headers});

    constructor(public router: Router,
                private http: Http,
                private cookieService: CookieService) {
    }

    get(url: string, urlSearchParams: URLSearchParams): Observable<Object> {
        if (urlSearchParams == null) {
            return this.http.get(url, this.getRequestOptions())
                .map(res => {
                    return this.extractData(res);
                }).catch(this.handleError.bind(this));
        }
        else {
            return this.http.get(url, this.getRequestOptionsWithParams(urlSearchParams))
                .map(res => {
                    return this.extractData(res);
                })
                .catch(this.handleError.bind(this));
        }
    }

    getRaw(url: string, urlSearchParams: URLSearchParams): Observable<Object> {
        if (urlSearchParams == null) {
            return this.http.get(url, this.getRequestOptions())
                .map(res => {
                    return this.extractRaw(res);
                }).catch(this.handleError.bind(this));
        } else {
            return this.http.get(url, this.getRequestOptionsWithParams(urlSearchParams))
                .map(res => {
                    return this.extractRaw(res);
                })
                .catch(this.handleError.bind(this));
        }
    }

    downloadExcelFile(url: string) {
        return this.http.get(url, this.getRequestOptionsWithBlobType())
            .map(resp=> resp.blob()).subscribe(blob=> {
                FileSaver.saveAs(blob, 'Export.xlsx');
            }, error => this.handleError(error));
    }
    delete(url: string): Observable<Object> {
        return this.http.delete(url, this.getRequestOptions())
            .map(res => this.extractData(res))
            .catch(this.handleError.bind(this));
    }

    deleteRaw(url: string): Observable<Object> {
        return this.http.delete(url, this.getRequestOptions())
            .map(res => this.extractRaw(res))
            .catch(this.handleError.bind(this));
    }

    put(url: string, requestBodyObject: Object): Observable<Object> {
        const requestBody = requestBodyObject;
        if (requestBody == null) {
            return this.http.put(url, null, this.getRequestOptions())
                .map(res => this.extractData(res))
                .catch(this.handleError.bind(this));
        }
        else {
            return this.http.put(url, JSON.stringify(requestBody), this.getRequestOptions())
                .map(res => this.extractData(res))
                .catch(this.handleError.bind(this));
        }
    }

    putRaw(url: string, requestBodyObject: Object): Observable<Object> {
        const requestBody = requestBodyObject;
        if (requestBody == null) {
            return this.http.put(url, null, this.getRequestOptions())
                .map(res => this.extractRaw(res))
                .catch(this.handleError.bind(this));
        }
        else {
            return this.http.put(url, JSON.stringify(requestBody), this.getRequestOptions())
                .map(res => this.extractRaw(res))
                .catch(this.handleError.bind(this));
        }
    }

    post(url: string, requestBodyObject: Object): Observable<Object> {
        const requestBody = requestBodyObject;
        if (requestBody == null) {
            return this.http.post(url, null, this.getRequestOptions())
                .map(res => this.extractData(res))
                .catch(this.handleError.bind(this));
        }
        else {
            let response =  this.http.post(url, JSON.stringify(requestBody), this.getRequestOptions())
                .map(res => this.extractData(res))
                .catch(this.handleError.bind(this));
            return response;
        }
    }

    postRaw(url: string, requestBodyObject: Object): Observable<Object> {
        const requestBody = requestBodyObject;
        if (requestBody == null) {
            return this.http.post(url, null, this.getRequestOptions())
                .map(res => this.extractRaw(res))
                .catch(this.handleError.bind(this));
        }
        else {
            let response =  this.http.post(url, JSON.stringify(requestBody), this.getRequestOptions())
                .map(res => this.extractRaw(res))
                .catch(this.handleError.bind(this));
            return response;
        }
    }

    private extractData(res: Response) {
        let headers : any = res.headers;

        const body = res.json();
        if (body == null) {
            return;
        } else if (body.httpCode != 200) {
            this.handleError('ERROR')
        }
        if(headers!=null && headers.has("authorization")){
            this.cookieService.put(ApplicationConstants.COOKIE_AUTH_KEY, headers.get("authorization"));
        }
        return body.data;
    }

    private extractRaw(res: Response) {

        let headers : any = res.headers;

        const body = res.json();
        if (body == null) {
            return;
        } else if (body.httpCode != 200) {
            this.handleError('ERROR')
        }

        if(headers!=null && headers.has("authorization")){
            this.cookieService.put(ApplicationConstants.COOKIE_AUTH_KEY, headers.get("authorization"));
        }

        return body;
    }

    private handleError(error: Response | any) {
        console.log('ERROR!!!!' + error)
        if(error != undefined && (error.status == 403 || error.status == 400 || error.status == 401)){
            this.router.navigateByUrl("/login");
        }
        return Observable.throw(error || 'Server error');
    }


    public buildHeader(){
        let authKey =  this.cookieService.getObject(ApplicationConstants.COOKIE_AUTH_KEY);
        let myHeaders = null;
        if(authKey!=null) {
            myHeaders = new Headers({'Authorization': authKey, 'Cache-Control': 'no-cache', 'Content-Type': 'application/json'});
        }else{
            myHeaders = new Headers({'Content-Type': 'application/json'});
        }
        return myHeaders;
    }

    public buildHeaderAuthOnly() {
        let authKey =  this.cookieService.getObject(ApplicationConstants.COOKIE_AUTH_KEY);
        let myHeaders = null;
        myHeaders = new Headers({'Authorization': authKey});
        return myHeaders;
    }

    public returnAuthToken():string {
        return <string>this.cookieService.getObject(ApplicationConstants.COOKIE_AUTH_KEY);
    }

    public getRequestOptions(){
        return new RequestOptions({headers: this.buildHeader()});
    }
    public getRequestOptionsWithBlobType(){
        return new RequestOptions({responseType: ResponseContentType.Blob, headers: this.buildHeader()});
    }
    public getRequestOptionsWithParams(params){
        return new RequestOptions({headers: this.buildHeader(), search: params })
    }

    public callToExport(url: string, callback: Function) {
        let authKey : string =  this.cookieService.getObject(ApplicationConstants.COOKIE_AUTH_KEY).toString();
        var x=new XMLHttpRequest();
        x.open("GET", url, true);
        x.setRequestHeader("Content-type","application/json");
        x.setRequestHeader("Authorization", authKey);
        x.responseType = 'blob';
        x.onload=function(e){
            if (x.status == 200) {
                const blob = new Blob([x.response], { type: 'text/csv' });
                const url= window.URL.createObjectURL(blob);
                window.location.assign(url);
                callback();
            }
        }
        x.send();
    }

}
