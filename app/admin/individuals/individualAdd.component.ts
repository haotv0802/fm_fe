import {Component, OnInit, ViewChild} from "@angular/core";
import {Individual} from "./individual";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators, AbstractControl} from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import {IndividualAddService} from "./individualAdd.service";
import {DomainService} from "../common/domain.service";
import {Login} from "./login/login";
import {AlertComponent} from "../../common/modal/alert.component";
import {ModalComponent} from "../../common/modal/modal.component";

@Component({
  moduleId: module.id,
  templateUrl: 'individualAdd.component.html',
  styleUrls: ['individualAdd.component.css']
})
export class IndividualAddComponent implements OnInit {
  pageTitle: string;
  individual: Individual;
  individualForm: FormGroup;
  emailMessage: string;
  roles: string[];
  userNameMessage: string;
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(AlertComponent) alert: AlertComponent;

  constructor(
    private _individualAddService: IndividualAddService,
    private _domainService: DomainService,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.pageTitle = 'Individual Creation';
  }

  ngOnInit(): void {
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
      this.setMessage(emailControl));

    let userNameControl = this.individualForm.get('userName');
    userNameControl.valueChanges.subscribe(value => {
        if (value.length > 3) {
          this.checkUserName(value, userNameControl);
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
  }

  checkUserName(userName: string, userNameControl: AbstractControl): void {
    this._individualAddService.isUserNameExisting(userName).subscribe(
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

  openDialog(): void {
    this.modal.modalTitle = "LOGIN";
    this.modal.modalFooter = false;
    this.modal.modalMessage = true;
    this.modal.message = "Here Login component will load.";
    this.modal.open(Login);
  }

  save(): void {
    console.log('Saved: ' + JSON.stringify(this.individualForm.value));
  }

  openCalendar() {
    return false;
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

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(key =>
        this.validationMessages[key]).join(' ');
    }
  }
  private validationMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.'
  };

  backIndividualList() {
    this._router.navigate(["admin/individuals"]);
    return false;
  }
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