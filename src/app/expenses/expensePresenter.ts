export class ExpensePresenter {
  id: number;
  userId: number;
  amount: number;
  date: Date;
  name: string;
  moneySourceId: number;
  paymentMethod: string;
  cardNumber: string;
  cardInfo: string;
  spending: boolean;

  constructor() {
  }
}
