import {ApiService} from "../../../../shared/services/api.service";
import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CategoryMapperInDetail, MapperFilterRequest} from "../models/category-mappers";
import {PageRequest} from "../../../../shared/models/page-request";
import {GrossReportFilter} from "../../../gross-report/model/grossReport";
import {GrossReportService} from "../../../gross-report/sevice/gross-report.service";
import {BlockUIService} from "../../../../shared/services/block-ui.service";

@Injectable()
export class CategoryMappingService {

    private static CATEGORY_MAPPER_URL = '/api/categorymappers';
    private static CURRENT_CATEGORY_GROUPS_URL = 'api/categorymappers/getCurrentCategoryGroups';
    private static EXPORT_EXCEL_URL = 'api/categorymappers/exporting.xlsx';


    constructor(private apiService: ApiService, private blockUI: BlockUIService) {

    }

    getMappers( filter: MapperFilterRequest, pageRequest: PageRequest): Observable<any> {
        let requestParams: URLSearchParams = new URLSearchParams();
        requestParams.set("coIds", filter.coIds.join(','));
        requestParams.set("isUnmapped", filter.isUnmapped ? 'true': 'false');
        requestParams.set("compTeamName", filter.compTeamName);
        requestParams.set("snoopyTeamName", filter.snoopyTeamName);

        if (pageRequest != null) {
            requestParams.set('page', pageRequest.page.toString());
            requestParams.set('limit', pageRequest.size.toString());
        }
        return this.apiService.getRaw(CategoryMappingService.CATEGORY_MAPPER_URL, requestParams).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }

    exportToExcel(filter: MapperFilterRequest): void {

        let requestParams: URLSearchParams = new URLSearchParams();
        requestParams.set("coIds", filter.coIds.join(','));
        requestParams.set("isUnmapped", filter.isUnmapped ? 'true': 'false');
        requestParams.set("compTeamName", filter.compTeamName);
        requestParams.set("snoopyTeamName", filter.snoopyTeamName);

        let url = CategoryMappingService.EXPORT_EXCEL_URL + '?' +requestParams.toString();
        console.info(url);
        //open blank page(new tab) for downloading
        window.open('');
        this.apiService.downloadExcelFile(url);


    }
    updateMappers( mappers: Array<CategoryMapperInDetail>):  Observable<any> {
        return this.apiService.putRaw(CategoryMappingService.CATEGORY_MAPPER_URL , {
            'categoryMappers': mappers
        }).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }
    getCurrentCategoryGroups(): Observable<any> {
        return this.apiService.getRaw(CategoryMappingService.CURRENT_CATEGORY_GROUPS_URL, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error));
    }





}
