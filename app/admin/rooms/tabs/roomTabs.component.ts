import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RoomTabsService} from "./roomTabs.service";
import {ModalComponent} from "../../../common/modal/modal.component";
import {RoomUpdateService} from "./roomUpdate.service";

@Component({
  moduleId: module.id,
  templateUrl: 'roomTabs.component.html'
})
export class RoomTabsComponent implements OnInit {
  pageTitle: string;
  isActive: boolean = true;

  ngOnInit(): void {
  }
  constructor(
    private _roomTabsService: RoomTabsService,
    private _router: Router,
    private _modal: ModalComponent
  ) {
    this.pageTitle = 'Room Tabs';
  }

  close(): void {
    this._modal.close();
  }

  displayEdit() {
    this.isActive = true;
    return false;
  }

  displayImageUpdate() {
    this.isActive = false;
    return false;
  }
}
