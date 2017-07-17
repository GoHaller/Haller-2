import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LoginProvider } from './login.provider';

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

  public authForm: any;
  local: Storage;
  // private fbAuthDetail: Object;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loginProvider: LoginProvider,
    private formBuilder: FormBuilder, public modalCtrl: ModalController, public toastCtrl: ToastController,
    private localNotifications: LocalNotifications) {
    this.authForm = this.formBuilder.group({
      email: ['a033m771@ku.edu', Validators.compose([Validators.maxLength(30), Validators.required])],
      password: ['HelloAlex', Validators.compose([Validators.maxLength(30), Validators.required])]
    });
    this.local = new Storage('localstorage');
    this.localNotifications.on('click', (data: any) => {
      console.info('data', data);
    })
  }

  ionViewDidLoad() { }
  loginClicked(data) {
    this.loginProvider.login({ email: data.email, password: data.password }).subscribe((res: any) => {
      this.local.set('auth', res.token);
      this.local.set('uid', res.user._id);
      this.local.set('userInfo', JSON.stringify(res.user)).then(() => {
        this.navCtrl.setRoot('Tabs', {}, { animate: true, direction: 'forward' });
      });
    }, error => {
      // console.info('error', error);
      if (error.status = 401) {
        let toast = this.toastCtrl.create({
          message: 'Authention fail!',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    })
  }

  gotoLandingPage() { this.navCtrl.setRoot('Landing', {}, { animate: true, direction: 'forward' }); }
  gotoRegPage() { this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'forward' }); }

  notifyNow() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Haller',
      text: 'Single Local Notification',
      data: { secret: 'key' },
      // icon: 'http://example.com/icon.png',
      led: '00ff00'
    });   
  }
  // getFbLoginStatus() {
  //   // this.logoutFacebook();
  //   this.fb.getLoginStatus().then((res: any) => {
  //     console.info('getLoginStatus res', res);
  //     if (res.status != 'connected') {
  //       this.getFbLogin();
  //     } else if (res.status == 'connected') {
  //       this.fbAuthDetail = res.authResponse;
  //       this.getFbDetail();
  //     }
  //   }).catch(error => {
  //     console.info('getLoginStatus error', error);
  //   })
  // }

  // getFbLogin() {
  //   this.fb.login(['public_profile', 'user_hometown', 'email'])
  //     .then((res: FacebookLoginResponse) => {
  //       console.log('Logged into Facebook!', res);
  //       if (res.status == 'connected') {
  //         this.fbAuthDetail = res.authResponse;
  //         this.getFbDetail();
  //       }
  //     })
  //     .catch(e => console.log('Error logging into Facebook', e));
  // }

  // getFbDetail() {
  //   console.info('userID', this.fbAuthDetail['userID']);
  //   // this.fb.api(this.fbAuthDetail['userID'] + '/?field=id,email,first_name,last_name', [])
  //   this.fb.api(this.fbAuthDetail['userID'] + '/?fields=id,name,email,hometown,birthday,sports,likes{id,name}', ['user_likes', 'user_birthday'])
  //     // this.fb.api(this.fbAuthDetail['userID'] + '/movies', [])
  //     .then((res: any) => {
  //       console.info('api res', res);
  //     }).catch(e => {
  //       console.info('api error', e);
  //     });
  // }

  // logoutFacebook() {
  //   this.fb.logout().then((response) => {
  //     console.info('response', response);
  //   });
  // }
}
