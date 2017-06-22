import {Component, OnInit, OnDestroy}  from '@angular/core';
import {Image} from "./image";
import {ImagesService} from "./images.service";
import {Router} from "@angular/router";
import {ImagesUpdateService} from "./imagesUpdate.service";
import {Constants} from "../../common/constant";

@Component({
  moduleId: module.id,
  templateUrl: 'images.component.html',
  styleUrls: ['images.component.01.css', 'images.component.02.css']
})
export class ImagesComponent implements OnInit, OnDestroy {
  pageTitle: string;
  images: Image[];
  constructor(
    private _imagesService: ImagesService,
    private _router: Router,
    private _imageUpdateService: ImagesUpdateService,
    private _constants: Constants
  ) {
    this.pageTitle = 'Images Management';
    // this.getImages();
  }

  ngOnInit(): void {
    console.log("get images in ngOnInit");
    this.getImages();
  }

  ngOnDestroy(): void {
  }

  displayImage(image: Image) {
    console.log(image);
  }

  editImage(image: Image) {
    this._imageUpdateService.image = image;
    this._router.navigate(["admin/images/update"]);
  }

  getImages(): void {
    this._imagesService.getImages().subscribe(
      (images) => {
        this.images = images;
        for (let i = 0; i < this.images.length; i++) {
          let imgTmp = this.images[i];
          this._imagesService.getImageFile(imgTmp.id)
            .subscribe(
              (res) => {
                // console.log("res.headers.content-type");
                // console.log(res.headers);
                // console.log(res.headers.get('content-type'));
                // imgTmp.imageURL = "data:image/jpeg;base64," + res.json().encodedString;
                imgTmp.imageURL = `data:${res.headers.get('content-type')};base64,` + res.json().encodedString;
              },
              (error) => {
                console.log(error);
              }
            )
          ;
        }
        // $('.carousel').carousel();
      },
      (error) => {
        console.log("images component - get images - Error:");
        console.log(error);
      }
    )
    ;
  }

  hexToBase64(str: string) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
  }

  getImageFile(image: Image): any {
    this._imagesService.getImageFile(image.id)
      .subscribe(
        (res) => {
          console.log("res");
          console.log(res.encodedString);
          // console.log("====");
          // console.log(JSON.stringify(res));
          image.imageURL = "data:image/jpeg;base64," + res.encodedString;
        },
        (error) => {
          console.log(error);
        }
      )
    ;
  }

  counter(length: number){
    return new Array(length);
  }

  isActive(url: string) {
    return url === this.images[0].imageURL;
    // return url;
  }
}