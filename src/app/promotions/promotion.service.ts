import {Injectable} from '@angular/core';
import {Constants} from '../common/constant';
import {HTTPService} from '../common/HTTP.service';
import {Observable} from 'rxjs/Observable';
import {PromotionPresenter} from './promotionPresenter';

@Injectable()
export class PromotionService {
  constructor(
    private  _httpService: HTTPService,
    private _constant: Constants
  ) {

  }

  getPromotion(promotionpresenter: PromotionPresenter): Observable<any> {
    let title: string ;
    let content: string;
    let start_date: string;
    let end_date: string;
    let bank_id: string;
    let category_id: string;
    title = promotionpresenter.title != null ? '?title=' + promotionpresenter.title : '?';
    content = promotionpresenter.content != null ? '&content=' + promotionpresenter.content : '';
    start_date = promotionpresenter.start_date != null ? '&start_date=' + promotionpresenter.start_date : '';
    end_date = promotionpresenter.end_date != null ? '&end_date=' + promotionpresenter.end_date : '';
    bank_id = promotionpresenter.bank_id != null ? '&bank_id=' + promotionpresenter.bank_id : '';
    category_id = promotionpresenter.category_id != null ? '&category_id=' + promotionpresenter.category_id : '';
    return this._httpService.get(this._constant.BANK_PROMO + title + content + start_date
                                    + end_date + bank_id + category_id)
                            .map((res) => { return res.json(); });
  }

}
