export class ExpensePresenter {
  id: number;
  userId: number;
  amount: number;
  date: Date;
  name: string;
  moneySourceId: number;
  moneySourceName: string;
  paymentMethod: string;
  cardNumber: string;
  cardInfo: string;
  spending: boolean;
  updated: boolean;
  dateModel: any;

  constructor() {
  }
}
