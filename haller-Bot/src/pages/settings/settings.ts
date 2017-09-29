import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ActionSheetController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth-provider";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {
  local: Storage;
  uid: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private actionSheetCtrl: ActionSheetController,
    storage: Storage, private authProvider: AuthProvider) {
    this.local = storage;
  }

  ionViewDidLoad() {
    this.local.get('uid').then((val) => {
      this.uid = val;
    });
    // console.log('ionViewDidLoad Settings');
  }

  goToAddress(name) {
    this.navCtrl.push(name, {}, { animate: true, direction: 'forward' });
  }

  logoutClicked() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Log me out',
          handler: () => {
            this.logMeOut();
          }
        }, {
          text: 'Stay',
          handler: () => { }
        }
      ]
    });
    actionSheet.present();

  }

  logMeOut() {
    this.authProvider.logout(this.uid).subscribe(res => {
      // console.info('res', res);
      this.local.remove('auth');
      this.local.remove('uid');
      this.local.remove('userInfo');
      this.navCtrl.push('Registration', {}, { animate: true, direction: 'back' });
    }, error => {
      this.authProvider.http.showError(error);
    });

  }
}
