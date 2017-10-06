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
  showBotIntro: Boolean = false;
  showBotIntroClass: Boolean = false;
  navData: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage) {
    this.local = storage;
    this.navData = navParams.data;
    this.showBotIntro = false;
    this.showBotIntroClass = false;
  }

  ionViewDidLoad() {
    switch (this.navData.intro) {
      case 1:
        this.showBotIntro = true;
        break;
      default:
        break;
    }
    setTimeout(() => {
      switch (this.navData.intro) {
        case 1:
          this.showBotIntroClass = true;
          break;
        default:
          break;
      }
    }, 800);
  }

  goBack() {
    this.showBotIntroClass = false;
    setTimeout(() => {
      this.showBotIntro = false;
      this.navCtrl.pop();
    }, 800);
  }


}
