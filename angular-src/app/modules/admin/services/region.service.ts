import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http'

import { ApiService } from '../../../shared/services/api.service';
import { PageRequest } from '../../../shared/models/page-request';
import { Region, RegionFilter } from '../models/region';
import { isEmpty } from '../../../shared/utils';

const ROOT_URL = '/api/region';

@Injectable()
export class RegionService {
    constructor(private apiService: ApiService) {
    }

    getAll(): Observable<any> {
        return this.apiService.getRaw(ROOT_URL+'/all', null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    getDepartment(): Observable<any> {
        return this.apiService.getRaw(ROOT_URL+'/department', null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    search(filter: RegionFilter, pageRequest: PageRequest): Observable<any> {
        let query: URLSearchParams = new URLSearchParams();
        if (!isEmpty(filter.depart)) {
            query.set('depart', filter.depart);
        }
        if (!isEmpty(filter.keyword)) {
            query.set('keyword', filter.keyword);
        }
        if (!isEmpty(filter.used)) {
            query.set('used', filter.used);
        }

        if (pageRequest != null) {
            pageRequest.buildPagingParam(query);
            pageRequest.buildSortParam(query);
        }

        return this.apiService.getRaw(ROOT_URL, query).map(resp => {
             return resp;
         }).catch(error => Observable.throw(error))
    }

    create(region: Region): Observable<any> {
        return this.apiService.put(ROOT_URL, region).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    update(region: Region): Observable<any> {
        return this.apiService.post(ROOT_URL, region).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }
}