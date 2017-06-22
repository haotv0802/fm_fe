///<reference path="../../common/HTTP.service.ts"/>
import {Injectable} from "@angular/core";
import {Constants} from "../../common/constant";
import {HTTPService} from "../../common/HTTP.service";
import {Observable} from "rxjs";
import {Image} from "./image";

@Injectable()
export class ImagesUpdateService {

  image: Image;

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  getImageById(id: number): Observable<Image> {
    return this._httpService.get(this._constants.ADMIN_IMAGES_SERVICE_URL + `/${id}/info`)
      .map(
        (res) => {return <Image>res.json()}
      )
    ;
  }

  updateImage(image: Image): Observable<any> {
    return this._httpService.post(this._constants.ADMIN_IMAGE_UPDATE_SERVICE_URL, image)
      // .do(data => console.log('updateImage Info: ' + JSON.stringify(data)))
      ;
  }

  updateImageFile(id: number, imageFile: any): Observable<any> {
    return this._httpService.postImageFile(this._constants.HOST + `/admin/images/${id}/updateImage`, imageFile)
      // .do(data => console.log('image update component - updateImageFile: ' + JSON.stringify(data)))

    ;
  }
}
