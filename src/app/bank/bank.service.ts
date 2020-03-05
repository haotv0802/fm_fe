import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BankPresenter} from './bankPresenter';
import {Constants} from '../common/constant';
import {HTTPService} from '../common/HTTP.service';

@Injectable()
export class BankService {
  constructor(
    private _httpService: HTTPService,
    private _constants: Constants
  ) {

  }

  getBanks(): Observable<BankPresenter> {
    return this._httpService.get(this._constants.BANK)
      .map((res) => {
        return <BankPresenter> res.json(); })
      ;
  }

  getAllBanks(): Observable<BankPresenter[]> {
    return this._httpService.get(this._constants.ALL_BANKS)
      .map((res) => {
        return <BankPresenter[]> res.json(); })
      ;
  }
}
