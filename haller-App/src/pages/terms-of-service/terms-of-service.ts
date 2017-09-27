import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrivacyPolicy page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-terms-of-service',
  templateUrl: 'terms-of-service.html',
})
export class TermsofService {

  pntOption: string = 'pp';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (navParams.data['sec']) {
      this.pntOption = navParams.data['sec'];
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TermsofService');
  }

}
