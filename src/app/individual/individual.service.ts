import {Injectable} from '@angular/core';
import {Constants} from '../common/constant';
import {HTTPService} from '../common/HTTP.service';
import {IndividualPresenter} from './individualPresenter';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class IndividualService {
  constructor(
    private _httpService: HTTPService,
    private _constants: Constants
  ) {

  }
  getIndividual(): Observable<IndividualPresenter> {
    return this._httpService.get(this._constants.INDIVIDUAL)
      .map((res) => {
        return <IndividualPresenter> res.json(); })
      ;
  }
}
