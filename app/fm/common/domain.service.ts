import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HTTPService} from "../../common/HTTP.service";
import {Constants} from "../../common/constant";

@Injectable()
export class DomainService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  getRoles(): Observable<string[]> {

    return this._httpService.get(this._constants.ADMIN_ROLES_SERVICE_URL)
      .map((res) => {
        // let roomType = new RoomType();
        // let data = res.json();
        // roomType.name = data[0].name;
        // roomType.imageInfo = data[0].imageInfo;
        // roomType.imageURL = data[0].imageURL;
        // roomType.imageId = data[0].imageId;
        // return roomType;
        return <string[]>res.json();
      })
      ;
  }

}
