import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Constants} from "../../common/constant";
import {Individual} from "./individual";
import {HTTPService} from "../../common/HTTP.service";
import {URLSearchParams} from "@angular/http";

@Injectable()
export class IndividualsService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  getIndividuals(): Observable<Individual[]> {
    return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_SERVICE_URL)
      .map((res) => {return <Individual[]>res.json()})
      ;
  }

  getIndividualsWithPaging(pageNum: number): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set("page", pageNum.toString());
    params.set("size", "5");

    return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_WITH_PAGING_SERVICE_URL, params)
      .map((res) => {return res.json()})
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      ;
  }

  getIndividualsCount(): Observable<number> {
    return this._httpService.get(this._constants.ADMIN_INDIVIDUALS_COUNT_SERVICE_URL)
      .map((res) => {return <number>res.json().individualsCount})
      // .do(data => console.log(data))
      ;
  }
}
