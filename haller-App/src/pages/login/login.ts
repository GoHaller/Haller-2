import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../../shared/providers/auth.provider';
import { ProfileProvider } from "../../shared/providers/profile.provider";

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  private fbAuthDetail: any;
  // private facebookData: any;
  public authForm: any;
  local: Storage;
  // private fbAuthDetail: Object;
  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
    private ProfileProvider: ProfileProvider, private formBuilder: FormBuilder, public toastCtrl: ToastController,
    statusBar: StatusBar, splashScreen: SplashScreen, private loadingCtrl: LoadingController,
    public alertCtrl: AlertController, storage: Storage, private event: Events) {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });
    this.local = storage;
    statusBar.styleDefault();
    splashScreen.hide();
    // email: ['m196f845@ku.edu', Validators.compose([Validators.maxLength(30), Validators.required])],
    // password: ['MahdiHaller', Validators.compose([Validators.maxLength(30), Validators.required])]
    // this.localNotifications.on('click', (data: any) => {
    //   console.info('data', data);
    // })
  }

  ionViewDidLoad() { }
  loginClicked(data) {
    this.loginToHaller({ email: data.email, password: data.password });
    // this.loginToHaller({ email: data.email });
  }

  loginToHaller(data) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      // duration: 3000,
      dismissOnPageChange: true
    });
    loader.present();
    if (data.email)
      data.email = data.email.trim();
    this.authProvider.login(data).subscribe((res: any) => {
      if (res.isBlocked) {
        let prompt = this.alertCtrl.create({
          title: 'Blocked',
          subTitle: "Admin has blocked you from using this app, please visit the administrator.",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'back' })
              }
            }
          ]
        });
        prompt.present();
      } else {
        this.local.set('auth', res.token);
        this.local.set('uid', res.user._id);
        this.local.set('userInfo', JSON.stringify(res.user)).then(() => {
          this.event.publish('user-updated');
          this.local.get('fcm-data').then((val) => {
            if (val) {
              let fcmData = JSON.parse(val);
              if (fcmData.deviceData) {
                let userData = res.user['notifications'];
                userData.deviceToken = fcmData.deviceData.token;
                userData.os = fcmData.deviceData.os;
                this.ProfileProvider.updateUser(res.user._id, { 'notifications': userData })
                  .subscribe((re: any) => {
                    loader.dismiss();
                    this.gotoTabsPage();
                  }, error => {
                    loader.dismiss();
                    console.info('updateUser error', error);
                  });
              } else {
                loader.dismiss();
                this.gotoTabsPage();
              }
            } else {
              loader.dismiss();
              this.gotoTabsPage();
            }
          })
        });
      }
    }, (error: any) => {
      loader.dismiss();
      console.info('error', error);
      let message = 'Please try later.';
      if (error.status == 401 || error._body.indexOf('No such user exists') > -1 || error._body.indexOf("Facebook account is already in use.") > -1) {
        message = 'Authention fail!';
      }
      let toast = this.toastCtrl.create({ message: message, duration: 3000, position: 'top' });
      toast.present();
    });
  }

  getFbLoginStatus() {
    // this.logoutFacebook();
    this.authProvider.checkFBLoginStatus().then((res: any) => {
      console.info('getLoginStatus res', res);
      if (res.status != 'connected') {
        this.getFbLogin();
      } else if (res.status == 'connected') {
        this.fbAuthDetail = res.authResponse;
        this.loginToHaller({ facebookId: this.fbAuthDetail.userID });
      }
    }).catch(error => {
      console.info('getLoginStatus error', error);
    })
  }

  getFbLogin() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      // duration: 3000,
      dismissOnPageChange: true
    });
    loader.present();
    this.authProvider.logoutFromFB().then((response) => {
      this.authProvider.loginToFB()
        .then((res: any) => {
          console.log('Logged into Facebook!', res);
          if (res.status == 'connected') {
            this.fbAuthDetail = res.authResponse;
            loader.dismiss();
            this.loginToHaller({ facebookId: this.fbAuthDetail.userID });
          }
        })
        .catch(e => { console.log('Error logging into Facebook', e); loader.dismiss(); });
    }).catch(e => { console.log('Error logging out Facebook', e); loader.dismiss(); });
  }

  logoutFacebook() {
    this.authProvider.logoutFromFB().then((response) => {
      console.info('response', response);
    });
  }

  checkUsersFacebookLikes(user) {
    // console.log("user['facebook']", user['facebook']);
    if (user['facebook']) {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        // duration: 3000,
        dismissOnPageChange: true
      });
      loader.present();
      this.authProvider.getFBUserDetail(user['facebook'].id).then((res) => {
        console.log('tab facebook res', res);
        if (user['facebook'].id == res.id) {
          user['facebook'].likes = res.likes;
          this.ProfileProvider.updateUser(user._id, { 'facebook': user['facebook'] })
            .subscribe((re: any) => {
              loader.dismiss();
              this.gotoTabsPage();
            }, error => {
              loader.dismiss();
              console.info('updateUser error', error);
            });
        } else {
          this.gotoTabsPage();
          loader.dismiss();
        }
      }).catch(error => {
        console.log('tab facebook error', error);
        this.gotoTabsPage();
        loader.dismiss();
      })
    }
  }

  gotoTabsPage() { this.navCtrl.setRoot('TabsPage', {}, { animate: true, direction: 'forward' }); }
  gotoLandingPage() { this.navCtrl.setRoot('Landing', {}, { animate: true, direction: 'forward' }); }
  gotoRegPage() { this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'forward' }); }
}
