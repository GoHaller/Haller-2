import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'image-full',
    template: `
  <ion-content class="image-full-content">
    <button (click)="closeMe()" class="image-close-btn"><ion-icon [name]="'close'"></ion-icon></button>
    <img [src]="imgeSrc || '../../assets/img/logo.png'" class="fullscreen-image" />
  </ion-content>`
})

export class ImageFullComponent implements OnInit {
    public imgeSrc: String;
    constructor(private viewCtrl: ViewController, private navParams: NavParams) {
        this.imgeSrc = navParams.data.imgeSrc;
    }

    ngOnInit() { }

    closeMe() {
        this.viewCtrl.dismiss();
    }
}