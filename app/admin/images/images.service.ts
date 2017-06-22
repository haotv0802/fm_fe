import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Constants} from "../../common/constant";
import {HTTPService} from "../../common/HTTP.service";
import {Image} from "./image";

@Injectable()
export class ImagesService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  getImages(): Observable<Image[]> {
    return this._httpService.get(this._constants.ADMIN_IMAGES_SERVICE_URL)
      .map((res) => {
        // let roomType = new RoomType();
        // let data = res.json();
        // roomType.name = data[0].name;
        // roomType.imageInfo = data[0].imageInfo;
        // roomType.imageURL = data[0].imageURL;
        // roomType.imageId = data[0].imageId;
        // return roomType;
        return <Image[]>res.json();
      })
      ;
  }

  getImageFile(id: number): Observable<any> {
    return this._httpService.get(this._constants.ADMIN_IMAGES_SERVICE_URL + `/${id}.JPG/file`)
      // .map((res) => {
      //   return res.json();
      // })
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      // .do(res => console.log('_body: ' + res._body))

    ;
  }
}
