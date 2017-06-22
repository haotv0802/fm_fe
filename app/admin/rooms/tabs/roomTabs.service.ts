import {Injectable} from "@angular/core";
import {HTTPService} from "../../../common/HTTP.service";
import {Constants} from "../../../common/constant";

@Injectable()
export class RoomTabsService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

}
