import {MoneySourcePresenter} from './moneySourcePresenter';

export class IndividualPresenter {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthday: string;
  gender: string;
  email: string;
  phoneNumber: string;
  income: number;

  moneySourcePresenters: MoneySourcePresenter[];

  constructor() {
  }
}
