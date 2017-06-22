import {Injectable} from "@angular/core";
import {HTTPService} from "../../../common/HTTP.service";
import {Constants} from "../../../common/constant";
import {RoomType} from "../roomType";
import {Observable} from "rxjs";

@Injectable()
export class RoomUpdateService {
  public roomType: RoomType;

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants
  ) {

  }

  updateRoomType(roomType: RoomType): Observable<any> {
    return this._httpService.patch(this._constants.ADMIN_ROOMS_ROOM_TYPE_UPDATE_SERVICE_URL, roomType)
      // .map((res) => res.json())
      // .do(data => console.log('All: ' + JSON.stringify(data)))
      ;
  }
}
