import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class Landing {
  local: Storage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.local = new Storage('localstorage');
    // this.local.get('userInfo').then((val) => {
    //   console.info('val', val);
    //   if (val) {
    //     this.navCtrl.setRoot('Tabs', { animate: true, direction: 'forward' });
    //   }
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Landing');
  }

  gotoRegistrationPage(flag) {
    this.navCtrl.setRoot('Registration', { reg: flag }, { animate: true, direction: 'forward' });
  }

  gotoLoginPage() {
    this.navCtrl.setRoot('Login', {}, { animate: true, direction: 'back' });
  }

}
