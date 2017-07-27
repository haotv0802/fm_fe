import {EventExpense} from "./eventExpense";
export class Event {
  id: number;
  userId: number;
  name: string;
  amount: number;
  date: Date;
  forPerson: string;
  expenses: EventExpense[];
  total: number;
  constructor() {
  }
}