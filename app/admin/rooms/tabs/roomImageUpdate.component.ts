import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'room-image-update',
  moduleId: module.id,
  templateUrl: 'roomImageUpdate.component.html'
})
export class RoomImageUpdateComponent implements OnInit {
  pageTitle: string;

  constructor(
              private _router: Router,
              private fb: FormBuilder
  ) {
    this.pageTitle = 'Individual Image Update';
  }

  ngOnInit(): void {

  }

}