import {Component, OnInit} from "@angular/core";
import {User} from "./user";
import {UsersUpdateService} from "./usersUpdate.service";
import {KeyValuePair} from "../../common/keyValuePair";
import {Observable} from "rxjs/Rx";
import {Constants} from "../../common/constant";
import {Router} from "@angular/router";
import {ToasterService} from "angular2-toaster";
import {ModalComponent} from "../../common/modal/modal.component";

@Component({
  moduleId: module.id,
  templateUrl: 'usersUpdate.component.html'
})
export class UsersUpdateComponent implements OnInit {
  // pageTitle: string;
  users: User[];
  roles: KeyValuePair[];
  saveDisabled: boolean = true;
  modal: ModalComponent;

  constructor(
    private _userUpdateService: UsersUpdateService,
    private _constants: Constants,
    private _router: Router,
    private _toasterService: ToasterService,
    private _modal: ModalComponent
  ) {
    // this.pageTitle = 'User component';
    this.modal = _modal
  }

  close() {
    this.modal.close();
  }

  ngOnInit(): void {
    Observable.forkJoin(
      this._userUpdateService.getUsers(),
      this._userUpdateService.getRolesInfo()
    ).subscribe(
      (data) => {
        this.users = data[0];
        this.roles = data[1];
      },
      (error) => {
        console.log(error);
      }
    )
    ;
  }

  getUsers(): void {
    this._userUpdateService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  getRolesInfo(): void {
    this._userUpdateService.getRolesInfo().subscribe(
      (roles: KeyValuePair[]) => {
        this.roles = roles;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onSelectChange(event: any, userTemp: User): void {
    this.saveDisabled = false;
    userTemp.roleId = event.target.value;
  }

  save(): void {
    this._userUpdateService.updateUsersRoles(this.users).subscribe(
      (res) => {
        if (res.status == this._constants.HTTP_STATUS_OK) {
          this._toasterService.pop(this._constants.TOASTER_SUCCESS, "Users updated successfully");
          // this._router.navigate(["admin/users"]);
          let timer = Observable.interval(3000);
          timer.subscribe(
            () => {
              // this._router.navigate(["admin/users"]);
              this.close();
            }
          );
        } else {
          this._toasterService.pop(this._constants.TOASTER_ERROR, "Users updated unsuccessfully");
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
    ;
  }
}
