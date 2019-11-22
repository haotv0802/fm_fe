import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http'

import { ApiService } from '../../../shared/services/api.service';
import { PageRequest } from '../../../shared/models/page-request';
import { Category, CategoryFilter } from '../models/category';
import { isEmpty } from '../../../shared/utils';

const ROOT_URL = '/api/competitor/salesInfo';

@Injectable()
export class CategoryService {
    constructor(private apiService: ApiService) {
    }

    search(filter: CategoryFilter, pageRequest: PageRequest): Observable<any> {
        let query: URLSearchParams = new URLSearchParams();
        if (!isEmpty(filter.dealSrl)) {
            query.set('dealSrl', filter.dealSrl);
        } else {
            if (!isEmpty(filter.startDate)) {
                query.set('startDate', filter.startDate.formatted);
            }
            if (!isEmpty(filter.endDate)) {
                query.set('endDate', filter.endDate.formatted);
            }
            if (!isEmpty(filter.confirm)) {
                query.set('confirm', filter.confirm);
            }
            if (!isEmpty(filter.category)) {
                query.set('category', filter.category);
            }
            if (!isEmpty(filter.keyword)) {
                query.set('keyword', filter.keyword);
            }
            if (!isEmpty(filter.competitor)) {
                query.set('competitor', filter.competitor);
            }
        }

        if (pageRequest) {
            pageRequest.buildPagingParam(query);
            pageRequest.buildSortParam(query);
        }

        return this.apiService.getRaw(ROOT_URL, query).map(resp => {
             return resp;
         }).catch(error => Observable.throw(error))
    }

    getCategoryList(type: string): Observable<any> {
        return this.apiService.getRaw(`/api/category/${type}`, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    findByCoDealId(coDealId: string): Observable<any> {
        return this.apiService.getRaw(`${ROOT_URL}/${coDealId}`, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    updateCategory(categoryNo: number, coDealId: string): Observable<any> {
        return this.apiService.post(`${ROOT_URL}/updateCategory/${categoryNo}/${coDealId}`, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    confirmCategory(coDealId: string, confirm: string): Observable<any> {
        return this.apiService.post(`${ROOT_URL}/confirmCategory/${coDealId}/${confirm}`, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

}