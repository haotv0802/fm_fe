import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CategoryPresenter} from './categoryPresenter';
import {Constants} from '../common/constant';
import {HTTPService} from '../common/HTTP.service';

@Injectable()
export class CategoryService {
  constructor(
    private _httpService: HTTPService,
    private _constants: Constants
  ) {

  }


  getAllCates(): Observable<CategoryPresenter[]> {
    return this._httpService.get(this._constants.ALL_CATES)
      .map((res) => {
        return <CategoryPresenter[]> res.json(); })
      ;
  }
}
