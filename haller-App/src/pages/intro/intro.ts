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
  showFeedIntro: Boolean = false;
  showFeedIntroClass: Boolean = false;
  showEventIntro: Boolean = false;
  showEventIntroClass: Boolean = false;
  showMsgIntro: Boolean = false;
  showMsgIntroClass: Boolean = false;
  showPeerIntro: Boolean = false;
  showPeerIntroClass: Boolean = false;
  navData: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage) {
    this.local = storage;
    this.navData = navParams.data;
    console.log('this.navData', this.navData);
    this.showFeedIntro = false;
    this.showEventIntro = false;
    this.showMsgIntro = false;
    this.showPeerIntro = false;

    this.showFeedIntroClass = false;
    this.showEventIntroClass = false;
    this.showMsgIntroClass = false;
    this.showPeerIntroClass = false;

  }

  ionViewDidLoad() {
    switch (this.navData.intro) {
      case 1:
        this.showFeedIntro = true;
        break;
      case 2:
        this.showEventIntro = true;
        break;
      case 3:
        this.showMsgIntro = true;
        break;
      case 4:
        this.showPeerIntro = true;
        break;
      default:
        break;
    }
    setTimeout(() => {
      switch (this.navData.intro) {
        case 1:
          this.showFeedIntroClass = true;
          break;
        case 2:
          this.showEventIntroClass = true;
          break;
        case 3:
          this.showMsgIntroClass = true;
          break;
        case 4:
          this.showPeerIntroClass = true;
          break;
        default:
          break;
      }
    }, 800);
  }

  goBack() {
    this.showFeedIntroClass = false;
    this.showEventIntroClass = false;
    this.showMsgIntroClass = false;
    this.showPeerIntroClass = false;
    setTimeout(() => {
      this.showFeedIntro = false;
      this.showEventIntro = false;
      this.showMsgIntro = false;
      this.showPeerIntro = false;
      this.navCtrl.pop();
    }, 800);
  }
  gotoProfile() {
    // this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'forward' });
    this.local.get('userInfo').then((val) => {
      let userInfo = JSON.parse(val);
      this.navCtrl.setRoot('Profile', { uid: userInfo._id }, { animate: true, direction: 'forward' });
    });
  }

}
