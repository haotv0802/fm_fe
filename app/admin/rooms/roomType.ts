import {Image} from "./image";
import {Price} from "./price";
export class RoomType {
  id: number;
  name: string;
  numOfPeople: number;
  numOfBeds: number;
  typeOfBed: string;
  images: Image[];
  prices: Price[];
}