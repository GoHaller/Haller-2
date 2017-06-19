import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ActionSheetController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginProvider } from '../login/login.provider';
import { ProfileEditProvider } from "../profile-edit/profile-edit.provider";

/**
 * Generated class for the ProfileSettings page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettings {

  private local: Storage;
  private userInfo: Object = {};
  uid: String;
  constructor(private app: App, private navCtrl: NavController, private navParams: NavParams,
    private loginProvider: LoginProvider, private actionSheetCtrl: ActionSheetController,
    private profileEditProvider: ProfileEditProvider, private event: Events) {
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then(val => {
      this.userInfo = JSON.parse(val);

      this.uid = this.userInfo['_id'];
    })
  }

  ionViewDidLoad() {
    this.event.subscribe('user-updated', () => {
      this.local.get('userInfo').then((val) => {
        this.userInfo = JSON.parse(val);
      });
    });
  }

  goToAddress(page: string) {
    this.navCtrl.push(page, { uid: this.uid }, { animate: true, direction: 'forward' });
  }

  logoutClicked() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Logout! Are you sure?',
      buttons: [
        {
          text: 'Log me out',
          handler: () => {
            this.logMeOut();
          }
        }, {
          text: 'Stay',
          handler: () => {
            console.log('No clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  logMeOut() {
    this.loginProvider.logout(this.uid).subscribe(res => {
      // console.info('res', res);
      this.local.remove('auth');
      this.local.remove('uid');
      this.local.remove('userInfo');
      this.app.getRootNav().setRoot('Login', {}, { animate: true, direction: 'back' });
    }, error => {
      console.info('logout error', error);
    });
  }

  requestRA() {
    if (!this.userInfo['isRARequested']) {
      this.profileEditProvider.updateUser(this.userInfo['_id'], { isRARequested: true })
        .subscribe((res: any) => {
          this.userInfo = res;
          this.local.set('userInfo', JSON.stringify(res)).then(() => { });
        }, error => {
          console.info('updateUser RA error', error);
        })
    }
  }

  presentRequestRAActionSheet() {
    let options = [];
    options.push({ text: 'Send', handler: () => { this.requestRA(); } });
    options.push({ text: 'Cancel', handler: () => { } });
    let actionSheet = this.actionSheetCtrl.create({ title: '', buttons: options });
    actionSheet.present();
  }

}
