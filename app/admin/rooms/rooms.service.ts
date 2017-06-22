import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Constants} from "../../common/constant";
import {RoomType} from "./roomType";
import {HTTPService} from "../../common/HTTP.service";

@Injectable()
export class RoomsService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

  getRoomTypes(): Observable<RoomType[]> {

    return this._httpService.get(this._constants.ADMIN_ROOMS_ROOM_TYPES_SERVICE_URL)
      .map((res) => {
        // let roomType = new RoomType();
        // let data = res.json();
        // roomType.name = data[0].name;
        // roomType.imageInfo = data[0].imageInfo;
        // roomType.imageURL = data[0].imageURL;
        // roomType.imageId = data[0].imageId;
        // return roomType;
        return res.json();
      })
      ;
  }

}
