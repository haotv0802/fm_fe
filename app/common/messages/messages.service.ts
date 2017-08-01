import {Injectable} from "@angular/core";
import {Constants} from "../constant";
import {HTTPService} from "../HTTP.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class MessagesService {

  private messages: any[]; // Messages can be for Admin, Staff, Customer.
  private commonMessages: any[]; // Messages for common pages, like Login, Navigation bar

  constructor(
    private _constants: Constants,
    private _httpService: HTTPService
  ) {
    // console.log("messages");
    // this.getMessages().subscribe(
    //   (res) => {
    //     this.keyValuePairs = res;
    //     // console.log("key value pairs: ");
    //     // console.log(this.keyValuePairs);
    //     // console.log(this.keyValuePairs["admin.roomList.name"]);
    //   },
    //   (error: Error) => {
    //     console.log(error);
    //   }
    // );
  }

  getMessagesByName(key: string): {} {
    try {
      let result = this.messages[key];
      if (result == undefined) {
        return {};
      } else {
        return result;
      }
    }
    catch (err) {
      // console.log(err);
      return {};
    }
    // let result = this.keyValuePairs[key];
    // if (null == result) {
    //   return "";
    // }
    // return result;
  }

  // getAdminMessages(): void {
  //   this._httpService.get(this._constants.ADMIN_MESSAGES_SERVICE_URL)
  //     .map(
  //       (res) => {
  //         // console.log(res.json());
  //         return res.json();
  //       }
  //     )
  //     // .do(
  //     //   (data) => {
  //     //     console.log("do print json");
  //     //     console.log(JSON.stringify(data));
  //     //   }
  //     // )
  //     // .subscribe(
  //     //   (res) => {
  //     //     this.keyValuePairs = res;
  //     //   },
  //     //   (error: Error) => {
  //     //     console.log(error);
  //     //   }
  //     // )
  //     .subscribe(
  //       (res) => {
  //         this.messages = res;
  //       },
  //       (error: Error) => {
  //         console.log(error);
  //       }
  //     );
  //   ;
  // }

  getCommonMessagesByName(key: string): {} {
    try {
      let result = this.commonMessages[key];
      if (result == undefined) {
        return {};
      } else {
        return result;
      }
    }
    catch (err) {
      return {};
    }
  }

  getCommonMessages(): void {
    this._httpService.get(this._constants.COMMON_MESSAGES_SERVICE_URL)
      .map(
        (res) => {
          console.log("getCommonMessages: ")
          console.log(res.json());
          return res.json();
        }
      )
      .subscribe(
        (res) => {
          this.commonMessages = res;
        },
        (error: Error) => {
          console.log(error);
        }
      );
    ;
  }

  getCommonMessages_(): Observable<any> {
    return this._httpService.get(this._constants.COMMON_MESSAGES_SERVICE_URL)
      .map(
        (res) => {
          // this.commonMessages = res.json();
          // return this.commonMessages;
          // console.log("mapping");
          return res.json();
        }
      )
      .do(
        (data) => {
          // console.log("do print json");
          // console.log(JSON.stringify(data));
          this.commonMessages = data;
        }
      )
      // .subscribe(
      //   (res) => {
      //     this.commonMessages = res;
      //   },
      //   (error: Error) => {
      //     console.log(error);
      //   }
      // );
    ;
  }
}