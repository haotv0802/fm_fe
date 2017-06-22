import {Component} from "@angular/core";
import {ModalComponent} from "../../../common/modal/modal.component";

@Component({
  selector: 'login',
  moduleId: module.id,
  templateUrl: 'login.html',
  styleUrls: ['login.css'],
})
export class Login {
  modal: ModalComponent;

  constructor(public _modal: ModalComponent) {
    this.modal = _modal
  }

  close() {
    this.modal.close();
  }

  login(username: string, password: string) {
    let data = {username: username, pasword: password}
    this.modal.close(data);
  }
}