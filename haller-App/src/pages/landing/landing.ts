import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { AuthProvider } from "../../shared/providers/auth.provider";

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
  internetConnected: boolean = false;
  userInfo: any = {};
  fbAuthDetail: any = {};
  fbPermission: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage, public alertCtrl: AlertController,
    private profileProvider: ProfileProvider, public authProvider: AuthProvider) {
    this.local = storage;
  }

  gotoTabsPage() { this.navCtrl.setRoot('TabsPage', {}, { animate: true, direction: 'forward' }); }
  gotoRegPage() { this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'forward' }); }

  ionViewDidLoad() {
    this.setUpTheApp();
  }

  setUpTheApp() {
    this.internetConnected = navigator.onLine;
    if (this.internetConnected) {
      this.local.get('userInfo').then((val) => {
        if (val) {
          this.userInfo = JSON.parse(val);
          if (this.userInfo.facebook && !this.userInfo.facebook.likes) {
            if (this.userInfo['facebook'].permission) {
              this.checkPermission(this.userInfo['facebook'].permission);
            } else {
              this.getUserPermission();
            }
          } else {
            this.gotoTabsPage();
          }
        } else {
          this.gotoRegPage();
        }
      });
    } else {
      let prompt = this.alertCtrl.create({
        title: 'You are not connected to internet',
        subTitle: "Please turn on your WiFi or mobile data.",
        buttons: [
          {
            text: 'Ok',
            handler: data => { }
          }
        ]
      });
      prompt.present();
    }
  }

  checkPermission(permissions) {
    let permited = false;
    permissions.data.forEach(permission => {
      if (!permited)
        permited = permission.status == 'granted' && permission.permission == 'user_likes';
    });
    this.fbPermission = permissions;
    if (permited) {
      this.gotoTabsPage();
    } else {
      this.getFbLogin();
    }
  }

  getUserPermission() {
    this.authProvider.getUsersPermission(this.userInfo['facebook'].id)
      .then((res) => {
        //user_likes
        this.checkPermission(res);
      }, error => {
        console.log('error', error);
        this.gotoTabsPage();
      })
  }

  getFbLogin() {
    this.authProvider.logoutFromFB().then((response) => {
      this.authProvider.loginToFB()
        .then((res: any) => {
          console.log('Logged into Facebook!', res);
          if (res.status == 'connected') {
            this.fbAuthDetail = res.authResponse;
            this.checkUsersFacebookLikes();
          }
        })
        .catch(e => { console.log('Error logging into Facebook', e); });
    }).catch(e => { console.log('Error logging out Facebook', e); });
  }

  logoutFacebook() {
    this.authProvider.logoutFromFB().then((response) => {
      console.info('response', response);
      this.gotoTabsPage();
    });
  }

  checkUsersFacebookLikes() {
    // console.log("user['facebook']", user['facebook']);
    if (this.userInfo['facebook']) {
      this.authProvider.getFBUserDetail(this.userInfo['facebook'].id).then((res) => {
        // console.log('tab facebook res', res);
        if (this.userInfo['facebook'].id == res.id) {
          this.userInfo['facebook'].likes = res.likes;
          if (this.fbPermission)
            this.userInfo['facebook'].permission = this.fbPermission;
          this.profileProvider.updateUser(this.userInfo._id, { 'facebook': this.userInfo['facebook'] })
            .subscribe((re: any) => {
              this.local.set('userInfo', JSON.stringify(re)).then(() => {
                this.gotoTabsPage();
              });
            }, error => {
              console.info('updateUser error', error);
              this.gotoTabsPage();
            });
        } else {
          this.gotoTabsPage();
        }
      }).catch(error => {
        console.log('tab facebook error', error);
        this.gotoTabsPage();
      })
    }
  }
}
