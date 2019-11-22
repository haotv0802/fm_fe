import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http'

import { ApiService } from '../../../shared/services/api.service';
import { PageRequest } from '../../../shared/models/page-request';
import { Area, AreaFilter, DealAreaFilter } from '../models/area';
import { isEmpty } from '../../../shared/utils';

const ROOT_URL = '/api/area';

@Injectable()
export class AreaService {
    constructor(private apiService: ApiService) {
    }

    search(filter: AreaFilter, pageRequest: PageRequest): Observable<any> {
        let query: URLSearchParams = new URLSearchParams();
        if (!isEmpty(filter.depart)) {
            query.set('depart', filter.depart);
        }
        if (!isEmpty(filter.keyword)) {
            query.set('keyword', filter.keyword);
        }
        if (!isEmpty(filter.region)) {
            query.set('region', filter.region.toString());
        }

        if (pageRequest != null) {
            pageRequest.buildPagingParam(query);
            pageRequest.buildSortParam(query);
        }

        return this.apiService.getRaw(ROOT_URL, query).map(resp => {
             return resp;
         }).catch(error => Observable.throw(error))
    }

    searchDealArea(filter: DealAreaFilter, pageRequest: PageRequest): Observable<any> {
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
            if (!isEmpty(filter.area)) {
                query.set('area', '' + filter.area);
            }
            if (!isEmpty(filter.keyword)) {
                query.set('keyword', filter.keyword);
            }
            if (!isEmpty(filter.competitor)) {
                query.set('competitor', filter.competitor);
            }
        }

        if (pageRequest != null) {
            pageRequest.buildPagingParam(query);
            pageRequest.buildSortParam(query);
        }

        return this.apiService.getRaw(`${ROOT_URL}/deal`, query).map(resp => {
             return resp;
         }).catch(error => Observable.throw(error))
    }

    create(model: Area): Observable<any> {
        return this.apiService.put(ROOT_URL, {
            regionNo: model.regionNo,
            address: model.address
        }).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    update(model: Area): Observable<any> {
        return this.apiService.post(ROOT_URL, {
            areaNo: model.areaNo,
            regionNo: model.regionNo,
            address: model.address
        }).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }
}