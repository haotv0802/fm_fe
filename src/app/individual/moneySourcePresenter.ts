import {BankPresenter} from '../bank/bankPresenter';

export class MoneySourcePresenter {
  id: number;
  name: string;
  startDate: string;
  expiryDate: string;
  cardNumber: string;
  creditLimit: number;
  terminated: boolean;
  bankId: number;
  bank: BankPresenter;

  constructor() {
  }
}
