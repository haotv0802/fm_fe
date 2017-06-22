export class Expense {
  id: number;
  userId: number;
  amount: number;
  date: Date;
  place: string;
  forPerson: string;
  cardId: number;
  paymentMethod: string;
  anEvent: boolean;
  cardNumber: string;
  cardInfo: string;

  constructor() {
  }
}