import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Constants} from "../../common/constant";
import {Image} from "./image";

@Injectable()
export class RoomImagesService {

  images: Image[];
  constructor(private _http: Http, private _constants: Constants) {
  }

}
