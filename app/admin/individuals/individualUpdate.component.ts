import {Component, OnInit, ViewChild} from "@angular/core";
import {Individual} from "./individual";
import {Router} from "@angular/router";
import {IndividualUpdateService} from "./individualUpdate.service";
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ValidatorFn} from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import {DomainService} from "../common/domain.service";
import {Login} from "./login/login";
import {AlertComponent} from "../../common/modal/alert.component";
import {ModalComponent} from "../../common/modal/modal.component";

@Component({
  moduleId: module.id,
  templateUrl: 'individualUpdate.component.html',
  styleUrls: ['individualUpdate.component.css']

})
export class IndividualUpdateComponent implements OnInit {
  pageTitle: string;
  individual: Individual;
  individualForm: FormGroup;
  emailMessage: string;
  userNameMessage: string;
  oldUserNameForCheck: string;
  roles: string[];
  isUserNameExisting: boolean = false;

  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(AlertComponent) alert: AlertComponent;

  public data: any;

  constructor(private _individualUpdateService: IndividualUpdateService,
              private _domainService: DomainService,
              private _router: Router,
              private fb: FormBuilder) {
    this.pageTitle = 'Individual Update';
  }

  openDialog(): void {
    this.modal.modalTitle = "LOGIN";
    this.modal.modalFooter = false;
    this.modal.modalMessage = true;
    this.modal.message = "Here Login component will load.";
    this.modal.open(Login);
  }

  openAlert(): void {
    this.alert.alertFooter = true;
    this.alert.cancelButton = true;
    this.alert.okButton = false;
    this.alert.alertHeader = true;
    this.alert.alertTitle = "A simple Alert modal window";
    this.alert.message = "It is a classic Alert modal with title, body, footer.";
    this.alert.cancelButtonText = "Ok, Got it.";
    this.alert.open();
  }

  getData(data: any) {
    this.data = data;
  }

  ngOnInit(): void {
    this.individual = this._individualUpdateService.individual;
    this.individualForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', [Validators.required, Validators.minLength(3)]],
      birthday: ['', [Validators.required, Validators.minLength(3)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),
      phoneNumber: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', [Validators.required, Validators.minLength(3)]]
    });
    let emailControl = this.individualForm.get('emailGroup.email');
    emailControl.valueChanges.debounceTime(1000).subscribe(value =>
      this.setErrorMessagesForEmailControl(emailControl));

    let userNameControl = this.individualForm.get('userName');
    userNameControl.valueChanges.subscribe(value => {
        if (this.oldUserNameForCheck != undefined && value.length > 3) {
          this.checkUserName(this.oldUserNameForCheck, value, userNameControl);
        } else {
          this.setErrorMessagesForUserNameControl(userNameControl);
        }
      }
    );

    this._domainService.getRoles().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        console.log(error);
      }
    );

    this.populateData();
  }

  checkUserName(oldUserName: string, userName: string, userNameControl: AbstractControl): void {
    this._individualUpdateService.isUserNameExisting(oldUserName, userName).subscribe(
      (res) => {
        if (res.isUserNameExisting) {
          // this.userNameMessage = "User Name is already existing.";
          userNameControl.setErrors({"existing" : true});
          // this.userNameMessage = Object.keys(userNameControl.errors).map(key =>
          //   this.userNameMessages[key]).join(' ');
          this.setErrorMessagesForUserNameControl(userNameControl);
        } else {
          this.userNameMessage = '';
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  validateUserName(control: FormControl): {[key: string]: any} {
    return new Promise(resolve => {
      // resolve({"existing": true});
      if (this.oldUserNameForCheck != undefined) {
        this._individualUpdateService.isUserNameExisting(this.oldUserNameForCheck, control.value).subscribe(
          (res) => {
            if (res.isUserNameExisting) {
              console.log("existing");
              resolve({'existing': true});
            } else {
              console.log("NOT existing");
              resolve(null);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        resolve(null);
      }
    });
  }

  setErrorMessagesForUserNameControl(control: AbstractControl): void {
    console.log(control.errors);
    this.userNameMessage = '';
    if ((control.touched || control.dirty) && control.errors) {
      this.userNameMessage = Object.keys(control.errors).map(key =>
        this.userNameMessages[key]).join(' ');
    }
  }
  private userNameMessages = {
    required: 'Please enter your user name.',
    minlength: 'The username must be longer than 3 characters.',
    existing: 'User Name is already existing.'
  }

  save(): void {
    console.log('Saved: ' + JSON.stringify(this.individualForm.value));
  }

  populateData(): void {
    this.individualForm.setValue({
      firstName: this.individual.firstName,
      lastName: this.individual.lastName,
      middleName: this.individual.middleName,
      gender: this.individual.gender,
      birthday: this.individual.birthday,
      emailGroup: {email: this.individual.email, confirmEmail: this.individual.email},
      phoneNumber: this.individual.phoneNumber,
      userName: this.individual.userName,
      role: this.individual.role
    });
    this.oldUserNameForCheck = this.individual.userName;
  }


  setErrorMessagesForEmailControl(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(key =>
        this.emailMessages[key]).join(' ');
    }
  }

  private emailMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.'
  };

  backIndividualList() {
    this._router.navigate(["admin/individuals"]);
    return false;
  }

  addIndividual() {
    this._router.navigate(["admin/individuals/add"]);
    return false;
  }

  onKey(event: any) {
    // console.log(event.target.value);
    // this._individualUpdateService.isUserNameExisting(event.target.value).subscribe(
    //   (res) => {
    //     console.log("res.isUserNameExisting");
    //     console.log(res.isUserNameExisting);
    //     this.isUserNameExisting = res.isUserNameExisting;
    //   }
    // );
    // console.log("userNameMessage: " + this.userNameMessage);
    // if (this.individualForm.get('userName').value == "hao") {
    //   this.userNameMessage = "User name is existing";
    // } else {
    //   this.userNameMessage = ""
    // }
  }

  // validateUserName(control: FormControl): {[key: string]: any} {
  //   if (!control.value) {
  //     return null;
  //   }
  //   return new Promise(resolve => {
  //     console.log(control.value);
  //     if (control.value == "hao") {
  //       console.log("existing");
  //       resolve({'existing': true});
  //     } else {
  //       console.log("NOT existing");
  //       resolve(null);
  //     }
  //   });
  //
  //   // return this._individualUpdateService.isUserNameExisting(control.value).subscribe(
  //   //   (res) => {
  //   //     if (res.isUserNameExisting) {
  //   //       console.log("existing");
  //   //       return {'existing': true};
  //   //     } else {
  //   //       console.log("NOT existing");
  //   //       return null;
  //   //     }
  //   //   },
  //   //   (error) => {
  //   //     return {'existing': true};
  //   //   }
  //   // );
  //
  //   // if (!control.value) {
  //   //   return null;
  //   // }
  //
  //   // console.log(value);
  //   // let isExisting = false;
  //   // console.log("at the end of subscribe: " + isExisting);
  //   // if (isExisting) {
  //   //   return {'existing': true};
  //   // } else {
  //   //   return null;
  //   // }
  //
  // }
}


function validateUserName(
  c: AbstractControl,
  oldUserNameForCheck: string,
  individualUpdateService: IndividualUpdateService): {[key: string]: any} | null {
    return new Promise<any>(resolve => {
      resolve({'existing': true});
      // if (this.oldUserNameForCheck != undefined) {
      //   this._individualUpdateService.isUserNameExisting(this.oldUserNameForCheck, c.value).subscribe(
      //     (res) => {
      //       if (res.isUserNameExisting) {
      //         console.log("existing");
      //         resolve({'existing': true});
      //       } else {
      //         console.log("NOT existing");
      //         resolve(null);
      //       }
      //     },
      //     (error) => {
      //       console.log(error);
      //     }
      //   );
      // } else {
      //   resolve(null);
      // }
    });
}

function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  let emailControl = c.get('email');
  let confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return {'match': true};
}