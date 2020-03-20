import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Constants} from '../common/constant';
import {HTTPService} from '../common/HTTP.service';
import {PaymentMethodPresenter} from './paymentMethodPresenter';

@Injectable()
export class PaymentMethodService {
  constructor(
    private _httpService: HTTPService,
    private _constants: Constants
  ) {

  }

  getAllPaymentMethods(): Observable<PaymentMethodPresenter[]> {
    return this._httpService.get(this._constants.PAYMENT_METHODS_LIST)
      .map((res) => {
        return <PaymentMethodPresenter[]> res.json(); })
      ;
  }
}
