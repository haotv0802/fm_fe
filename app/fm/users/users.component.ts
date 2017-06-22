import {Component, OnInit, ViewChild} from "@angular/core";
import {UsersService} from "./users.service";
import {User} from "./user";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {ModalComponent} from "../../common/modal/modal.component";
import {UsersUpdateComponent} from "./usersUpdate.component";

@Component({
  moduleId: module.id,
  templateUrl: 'users.component.html'
  // styleUrls: ['app/products/product-list.component.css']
})
export class UsersComponent implements OnInit {
  pageTitle: string;
  users: User[];
  settings = {
    columns: {
      id: {
        title: 'ID',
        // width: '20px',
        filter: true
      },
      name: {
        title: 'NAME',
        // width: '100px',
        editable: true,
        filter: false
      },
      role: {
        title: 'ROLE',
        // width: '100px',
        filter: true
      }
    },
    hideSubHeader: false,
    actions:{
      edit: true
    },
    delete:{
      confirmDelete: true
    },
    pager : {
      display : true,
      perPage: 3
    }
  };
  loaderOpen: boolean = true;
  @ViewChild(ModalComponent) modal: ModalComponent;

  constructor(
    private _usersService: UsersService,
    private _router: Router
  ) {
    this.pageTitle = 'User component';
  }

  ngOnInit(): void {
    // let timer = Observable.interval(1000);
    // // subscribing to a observable returns a subscription object
    // timer.subscribe(
    //   () => {
    //     this.getUsers();
    //   }
    // )
    // ;
    this.getUsers();
  }

  getUsers(): void {
    console.log("get users");
    this._usersService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.loaderOpen = false;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  editUser(): void {
    // this._router.navigate(["admin/usersUpdate"]);
    this.popupUsersUpdate();
  }

  popupUsersUpdate(): void {
    this.modal.modalTitle = "User Update";
    this.modal.modalFooter = false;
    this.modal.modalMessage = true;
    this.modal.documentWidth = 800;
    // this.modal.message = "Here Users Update component will load.";
    this.modal.open(UsersUpdateComponent);
  }
}
