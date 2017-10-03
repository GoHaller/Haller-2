import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth-provider";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {
  local: Storage;
  uid: string;
  userInfo: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private actionSheetCtrl: ActionSheetController,
    storage: Storage, private authProvider: AuthProvider, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.local = storage;
  }

  ionViewDidLoad() {
    this.local.get('uid').then((val) => {
      this.uid = val;
    });
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
    });
    // console.log('ionViewDidLoad Settings');
  }

  goToAddress(name) {
    this.navCtrl.push(name, {}, { animate: true, direction: 'forward' });
  }

  logoutClicked() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        { text: 'Log me out', handler: () => { this.logMeOut(); } },
        { text: 'Stay', handler: () => { } }
      ]
    });
    actionSheet.present();
  }

  logMeOut() {
    let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    loader.present();
    this.authProvider.logout(this.uid).subscribe(res => {
      // console.info('res', res);
      loader.dismiss();
      this.local.remove('auth');
      this.local.remove('uid');
      this.local.remove('userInfo');
      this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'back' });
    }, error => {
      loader.dismiss();
      this.authProvider.http.showError(error);
    });

  }

  presentPrompt() {
    const alert = this.alertCtrl.create({
      title: 'Change Name',
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Name',
          value: this.userInfo.firstName
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {
            if (data.firstName) {
              this.updateUser(data.firstName);
            }
          }
        }
      ]
    });
    alert.present();
  }

  updateUser(firstName) {
    let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    loader.present();
    this.authProvider.update({ userId: this.userInfo['_id'], firstName: firstName })
      .subscribe((res: any) => {
        loader.dismiss();
        this.userInfo = res;
        this.afertRegistration(res);
      }, error => {
        loader.dismiss();
        this.authProvider.http.showError(error);
      })
  }

  afertRegistration(res) {
    this.local.set('userInfo', JSON.stringify(res)).then(() => { });
  }
}
