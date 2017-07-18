import {Injectable} from "@angular/core";
import {HTTPService} from "../../../common/HTTP.service";
import {Constants} from "../../../common/constant";

@Injectable()
export class EventExpenseService {

  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }
}
