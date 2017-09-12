import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ActionSheetController, Events, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AuthProvider } from '../../shared/providers/auth.provider';
import { ProfileProvider } from "../../shared/providers/profile.provider";

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

  public local: Storage;
  public userInfo: Object = {};
  public notifications: Boolean = false;
  // public facebookBtnShow: Boolean = false;
  public fbAuthDetail: any;
  private loader: any = {};
  uid: String;
  constructor(private app: App, private navCtrl: NavController, private navParams: NavParams,
    private authProvider: AuthProvider, private actionSheetCtrl: ActionSheetController,
    public profileProvider: ProfileProvider, private event: Events, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, storage: Storage) {
    this.local = storage;
    this.ionViewDidEnter();
  }

  ionViewDidLoad() {
    // this.event.subscribe('user-updated', () => {
    //   this.local.get('userInfo').then((val) => {
    //     this.userInfo = JSON.parse(val);
    //   });
    // });
  }

  ionViewDidEnter() {
    this.local.get('userInfo').then(val => {
      this.userInfo = JSON.parse(val);
      this.notifications = this.userInfo['notifications'].enabled;
      // this.facebookBtnShow = this.userInfo['facebook'] && this.userInfo['facebook'].id && this.userInfo['password'] ? true : false;
      this.uid = this.userInfo['_id'];
    })
  }
  goBack() {
    this.navCtrl.pop({ animate: true, direction: 'forward' });
  }

  goToAddress(page: string) {
    this.navCtrl.push(page, { uid: this.uid }, { animate: true, direction: 'forward' });
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
          handler: () => {
            console.log('No clicked');
          }
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
      this.app.getRootNav().setRoot('Login', {}, { animate: true, direction: 'back' });
    }, error => {
      console.info('logout error', error);
    });
  }

  requestRA() {
    if (!this.userInfo['isRARequested']) {
      this.profileProvider.updateUser(this.userInfo['_id'], { isRARequested: true })
        .subscribe((res: any) => {
          this.userInfo = res;
          this.local.set('userInfo', JSON.stringify(res)).then(() => { });
        }, error => {
          console.info('updateUser RA error', error);
        })
    }
  }

  switchNotificationSetting() {
    if (this.notifications != this.userInfo['notifications'].enabled) {
      this.upadteUserInfo(this.userInfo['_id'], { 'notifications.enabled': this.notifications });
    }
  }

  upadteUserInfo(userId, data) {
    this.profileProvider.updateUser(userId, data)
      .subscribe((res: any) => {
        this.userInfo = res;
        this.local.set('userInfo', JSON.stringify(res)).then(() => {
          // this.facebookBtnShow = this.userInfo['facebook'] && this.userInfo['facebook'].id ? true : false;
          this.notifications = this.userInfo['notifications'].enabled;
        });
      }, error => {
        console.info('updateUser RA error', error);
      });
  }

  disableFacebook() {
    if (this.userInfo && this.userInfo['password']) {
      // this.logoutFacebook();
      this.upadteUserInfo(this.userInfo['_id'], { facebook: null });
      let alert = this.alertCtrl.create({
        title: 'Your facebook account successfully disconnected',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'You need to create an account password before unconnecting your Facebook account. Please go to your `Create Password` in the Settings to create your password.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  settingsFacebook() {
    let btns: any = [];
    if (this.userInfo['facebook']) {
      btns = [{
        text: 'Disconnect',
        handler: () => {
          this.disableFacebook();
        }
      }];
    } else {
      btns = [{
        text: 'Connect',
        handler: () => {
          // this.getFbLoginStatus();
          this.getFbLogin();
        }
      }];
    }
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Logout! Are you sure?',
      buttons: btns
    });
    actionSheet.present();
  }

  getFbLoginStatus() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      // duration: 3000,
      // dismissOnPageChange: true
    });
    this.loader.present();
    this.authProvider.checkFBLoginStatus().then((res: any) => {
      if (res.status != 'connected') {
        this.getFbLogin();
      } else if (res.status == 'connected') {
        this.authProvider.logoutFromFB().then((response) => {
          this.getFbLogin();
        }).catch(e => { console.log('Error logging out Facebook', e); if (this.loader.dismiss) this.loader.dismiss(); });
      }
    }).catch(error => {
      console.info('getLoginStatus error', error);  if (this.loader.dismiss) this.loader.dismiss();
    })
  }

  getFbLogin() {
    this.authProvider.loginToFB()
      .then((res: any) => {
        if (res.status == 'connected') {
          this.fbAuthDetail = res.authResponse;
          this.getFbDetail();
        }
      }).catch(error => {
        console.info('Error logging into Facebook', error);
        if (this.loader.dismiss)
          this.loader.dismiss();
      });
  }

  getFbDetail() {
    this.authProvider.getFBUserDetail(this.fbAuthDetail['userID'])
      .then((res: any) => {
        this.profileProvider.updateUser(this.userInfo['_id'], { facebook: res })
          .subscribe((apiRes: any) => {
            this.userInfo = apiRes;
            this.local.set('userInfo', JSON.stringify(this.userInfo)).then(() => {
              let alert = this.alertCtrl.create({
                title: 'Your facebook account successfully connected',
                buttons: ['OK']
              });
              alert.present();
              if (this.loader.dismiss)
                this.loader.dismiss();
            });

          }, error => {
            console.info('updateUser error', error);
            if (error._body.indexOf('Facebook account is already in use.') > -1) {
              let prompt = this.alertCtrl.create({
                title: "This facebook account is already connected with another user.",
                buttons: ['Ok']
              });
              prompt.present();
            }
            if (this.loader.dismiss)
              this.loader.dismiss();
          });
      }).catch(e => {
        console.info('fb api error', e);
        if (this.loader.dismiss) this.loader.dismiss();
      });
  }
  logoutFacebook() {
    this.authProvider.logoutFromFB().then((response) => {
      // console.info('response', response);
    });
  }

  presentRequestRAActionSheet() {
    let options = [];
    options.push({ text: 'Send', handler: () => { this.requestRA(); } });
    options.push({ text: 'Cancel', handler: () => { } });
    let actionSheet = this.actionSheetCtrl.create({ title: '', buttons: options });
    actionSheet.present();
  }

}
// let toast = this.toastCtrl.create({
//   message: 'Your facebook account successfully disconnected',
//   duration: 3000,
//   position: 'top'
// });
// message: 'Your account successfully connected',
