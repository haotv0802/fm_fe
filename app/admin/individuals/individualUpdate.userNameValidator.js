// import {IndividualUpdateService} from "./individualUpdate.service";
// import {FormControl} from "@angular/forms";
// import {Injectable} from "@angular/core";
//
// @Injectable()
// export class UserNameValidators {
//
//   constructor(private _individualService: IndividualUpdateService) { }
//
//   validateUserName(control: FormControl) {
//     return new Promise((resolve, reject) => {
//
//       this._individualService.isUserNameExisting(control.value).subscribe(
//         res => {
//           if (res.isUserNameExisting) {
//             resolve({existing: true});
//           } else {
//             resolve({existing: null});
//           }
//         },
//         error => {
//           resolve({existing: true});
//         }
//       )
//     });
//
//   }
// } 
//# sourceMappingURL=individualUpdate.userNameValidator.js.map