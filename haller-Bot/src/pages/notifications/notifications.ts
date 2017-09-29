import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
// $IMPORTSTATEMENT

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class Notifications {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Notifications');
  }

}
