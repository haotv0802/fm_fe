import {Injectable} from '@angular/core';
import {Constants} from '../common/constant';
import {HTTPService} from '../common/HTTP.service';
import {IndividualPresenter} from './individualPresenter';
import {Observable} from 'rxjs/Observable';
import {MoneySourcePresenter} from './moneySourcePresenter';

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
  getBankPromos(): Observable<String> {
    return this._httpService.get(this._constants.BANK_PROMO_CRAWL+"/1").map((res)=>{
      return <String> res.json();
    });
  }

  updateMoneySource(moneySource: MoneySourcePresenter): Observable<any> {
    return this._httpService.patch(this._constants.MONEY_SOURCE_UPDATE, moneySource)
      .map((res) => { return res.json(); })
      ;
  }
}
