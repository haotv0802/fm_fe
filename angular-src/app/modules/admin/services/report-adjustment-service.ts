import {Injectable} from "@angular/core";
import {ApiService} from "../../../shared/services/api.service";
import {Organization, ParentOrganization} from "../models/category";
import {Observable} from "rxjs/Observable";
import {CellData, RequestBody} from "../models/cell-data";

const URL_POST_APPLY_CHANGE_REPORT = "/api/competitor/cancelSummaries";

@Injectable()
export class ReportAdjustmentService {
    constructor(private apiService: ApiService) {
    };

    postApplyReportChanges(body: RequestBody): Observable<any> {
        return this.apiService.postRaw(URL_POST_APPLY_CHANGE_REPORT, body).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }
}
