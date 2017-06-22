import {Injectable} from "@angular/core";
import {Constants} from "../../common/constant";
import {Individual} from "./individual";
import {HTTPService} from "../../common/HTTP.service";

@Injectable()
export class IndividualDetailsService {

  public individual: Individual;
  constructor(
    private _httpService: HTTPService,
    private _constants: Constants) {
  }

}
