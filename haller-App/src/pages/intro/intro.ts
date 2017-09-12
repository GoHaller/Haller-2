import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Intro page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class Intro {
  private local: Storage;
  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage) {
    this.local = storage;
  }

  ionViewDidLoad() { }

  gotoProfile() {
    // this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'forward' });
    this.local.get('userInfo').then((val) => {
      let userInfo = JSON.parse(val);
      this.navCtrl.setRoot('Profile', { uid: userInfo._id }, { animate: true, direction: 'forward' });
    });
  }

}
