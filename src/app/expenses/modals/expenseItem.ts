import {Component} from "@angular/core";
import {ModalComponent} from '../../common/modal/modal.component';

@Component({
  selector: 'expenseItem',
  moduleId: module.id,
  templateUrl: 'expenseItem.html',
  styleUrls: ['expenseItem.css'],
})
export class ExpenseItem {
  modal: ModalComponent;

  constructor(public _modal: ModalComponent) {
    this.modal = _modal
  }

  close() {
    this.modal.close();
  }

  login(username: string, password: string) {
    // let data = {username: username, pasword: password}
    // this.modal.close(data);
  }
}
