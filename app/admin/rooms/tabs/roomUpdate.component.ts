import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import "rxjs/add/operator/debounceTime";
import {RoomUpdateService} from "./roomUpdate.service";
import {RoomType} from "../roomType";
import {ModalComponent} from "../../../common/modal/modal.component";
import {ToasterService} from "angular2-toaster";
import {Subscription} from "rxjs/Rx";
import {Constants} from "../../../common/constant";

@Component({
  selector: 'room-update',
  moduleId: module.id,
  templateUrl: 'roomUpdate.component.html'
})
export class RoomUpdateComponent implements OnInit, OnDestroy {

  pageTitle: string;
  roomForm: FormGroup;
  roomType: RoomType;
  loaderOpen: boolean = false;
  private sub: Subscription;

  constructor(private _router: Router,
              private fb: FormBuilder,
              private _modal: ModalComponent,
              private _roomUpdateService: RoomUpdateService,
              private _toasterService: ToasterService,
              private _constants: Constants
  ) {
    this.pageTitle = 'Individual Update';
  }

  ngOnInit(): void {
    this.roomType = this._roomUpdateService.roomType;
    // console.log(this.roomType);
    this.roomForm = this.fb.group({
      roomName: ['', [Validators.required, Validators.minLength(3)]],
      numOfPeople: ['', [Validators.required]],
      numOfBeds: ['', [Validators.required]],
      typeOfBeds: ['', [Validators.required]]
    });

    this.populateData();
  }

  ngOnDestroy(): void {
  }

  save() {
    this.loaderOpen = true;
    setTimeout(() => {this.updateRoomType()}, 1000);
    // this.updateRoomType();
  }

  populateData(): void {
    this.roomForm.patchValue({
      roomName: this.roomType.name,
      numOfPeople: this.roomType.numOfPeople,
      numOfBeds: this.roomType.numOfBeds,
      typeOfBeds: this.roomType.typeOfBed
    });
  }

  counter(length: number){
    return new Array(length);
  }

  updateRoomType(): void {

    this.roomType.name = this.roomForm.get("roomName").value;
    this.roomType.numOfBeds = parseInt(this.roomForm.get("numOfBeds").value);
    this.roomType.numOfPeople = parseInt(this.roomForm.get("numOfPeople").value);
    this.roomType.typeOfBed = this.roomForm.get("typeOfBeds").value;
    this._roomUpdateService.updateRoomType(this.roomType).subscribe(
      (response) => {
        this._toasterService.pop(this._constants.TOASTER_SUCCESS, "Room updated successfully");
        this._modal.close("data changed");

        this.loaderOpen = false;
      },
      (error: any) => {
        console.log("Error happens at roomUpdate");
        console.log(error);
      }
    )
    ;
  }
}