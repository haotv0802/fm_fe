import {Expense} from "./expense";
export class Event {
  id: number;
  userId: number;
  name: string;
  amount: number;
  date: Date;
  forPerson: string;
  expenses: Expense[];
  total: number;
  constructor() {
  }
}