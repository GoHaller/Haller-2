import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { AuthProvider } from '../../shared/providers/auth.provider';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Registration page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class Registration {
  private fbAuthDetail: any;

  @ViewChild('emailInput') emailInput;
  @ViewChild(Slides) slides: Slides;
  private local: Storage;
  private userInfo: Object = {};
  private authToken: string = '';
  private authForm: any;
  private detailForm: any;
  private currentTab: number = 0;
  private residence: string = '';
  private showResidenceOption: boolean = false;
  private fcmData: any;
  private facebookData: any;
  private years = [];
  private email: string = '';
  public loaderObj: any = null;
  public inviteCode: string = '';
  public universityData: any = { halls: ['Scholarship Hall', 'Oliver Hall', 'Ellsworth Hall', 'Oswald/Self Hall', 'New Hall'] };

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider,
    private profileProvider: ProfileProvider, private formBuilder: FormBuilder, public toastCtrl: ToastController,
    private loadingCtrl: LoadingController, statusBar: StatusBar, splashScreen: SplashScreen, private cloudinaryProvider: CloudinaryProvider, public alertCtrl: AlertController) {
    this.local = new Storage('localstorage');
    this.authForm = this.formBuilder.group({
      pwd1: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      pwd2: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    }, { validator: Registration.passwordsMatch });

    this.detailForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      graduationYear: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });
    let yr = new Date().getFullYear() + 1;
    this.years = [yr, yr + 1, yr + 2, yr + 3, yr + 4, yr + 5, yr + 6];
    statusBar.styleDefault();
    splashScreen.hide();
  }

  static passwordsMatch(cg: FormGroup): { [err: string]: any } {
    let pwd1 = cg.get('pwd1');
    let pwd2 = cg.get('pwd2');
    let rv: { [error: string]: any } = {};
    if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
      rv['passwordMismatch'] = true;
    }
    return rv;
  }

  ionViewDidLoad() {
    this.local.get('fcm-data').then((val) => {
      this.fcmData = JSON.parse(val);
    });
    this.slides.lockSwipes(true);
    this.authProvider.getUniversityData()
      .subscribe((res: any) => {
        if (res.halls) {
          this.universityData = res;
        }
      }, error => {
        console.log('getUniversityData error', error);
      })
  }

  swipeBack() {
    this.currentTab -= 1;
    this.swipeTo(this.currentTab);
  }

  swipeTo(index) {
    this.currentTab = index;
    this.slides.lockSwipes(false);
    this.slides.slideTo(index, 500);
    this.slides.lockSwipes(true);
  }

  gotoLoginPage() {
    this.navCtrl.setRoot('Login', {}, { animate: true, direction: 'back' });
  }

  selectResidence(residenceName) {
    this.residence = residenceName;
    this.showResidenceOption = false;
  }

  checkEmail() {
    if (this.authProvider.httpClient.kuEmailRegex.test(this.email))
      this.swipeTo(this.currentTab + 1);
  }

  createAccount(data) {
    if (this.email && data['pwd1']) {
      this.createNewAccount({ email: this.email, password: data.pwd1 });
    }
  }

  createNewAccount(data) {
    if (data.email && (data['password'] || data['facebook'])) {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        // duration: 3000,
        dismissOnPageChange: true
      });
      loader.present();
      this.authProvider.create(data)
        .subscribe((res: any) => {
          loader.dismiss();
          if (res.user) {
            this.userInfo = res.user;
            this.authToken = res.token;
            // console.info('data', data)
            if (data.facebook) {
              this.finishRegistration(this.detailForm.value);
              // this.swipeTo(this.currentTab + 2);
            }
            else
              this.swipeTo(this.currentTab + 1);
          } else if (res['_id']) {
            let message = 'Try with another email';
            let toast = this.toastCtrl.create({
              message: message,
              duration: 2000,
              position: 'middle'
            });
            toast.present();
          }
          // console.info('create this.userInfo', this.userInfo);
        }, error => {
          loader.dismiss();
          console.info('create error', error);
          if (error.status == 401 || error._body.indexOf('No such user exists') > -1 || error._body.indexOf("Facebook account is already in use.") > -1) {
            let prompt = this.alertCtrl.create({
              title: "Incorrect access code",
              buttons: [{ text: 'Ok', handler: data => { } }]
            });
            prompt.present();
          }
        })
    }
  }

  checkInviteCode() {
    // console.info('event', event.target.value);
    if (this.inviteCode.length > 0) {
      this.authProvider.checkInviteCode(this.inviteCode).subscribe((res: any) => {
        // console.info('checkInviteCode res', res);
        this.swipeTo(this.currentTab + 1);
        setTimeout(() => {
          this.emailInput.setFocus();
        }, 200);
      }, (error: any) => {
        // console.info('checkInviteCode error', error);
        if (error.status == 400 && error._body.indexOf('invalid code') > -1) {
          let prompt = this.alertCtrl.create({
            title: "Incorrect access code",
            buttons: [{ text: 'Ok', handler: data => { } }]
          });
          prompt.present();
        }
      })
    }
  }

  saveProfilePicture() {
    this.userInfo['currentProfile'].createdBy = this.userInfo['_id'];
    let user = {
      currentProfile: this.userInfo['currentProfile']
    }
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      // duration: 3000,
      dismissOnPageChange: true
    });
    loader.present();
    this.profileProvider.updateUser(this.userInfo['_id'], user)
      .subscribe((res: any) => {
        loader.dismiss();
        this.finishRegistration(this.detailForm.value);
      }, error => {
        loader.dismiss();
        console.info('updateUser currentProfile error', error);
      });
  }

  finishRegistration(data) {
    this.local.get('fcm-data').then((val) => {
      if (val)
        this.fcmData = JSON.parse(val);
      //genderPronouns: data['pronouns'].split(', '),
      let deviceData = { deviceToken: '', os: '' };
      if (this.fcmData) {
        if (this.fcmData.deviceData && this.fcmData.deviceData.token) {
          deviceData.deviceToken = this.fcmData.deviceData.token;
        }
        if (this.fcmData.deviceData && this.fcmData.deviceData.os) {
          deviceData.os = this.fcmData.deviceData.os;
        }
      }
      let user = {
        firstName: data['firstName'],
        lastName: data['lastName'],
        genderPronouns: [],//data['pronouns'] ? data['pronouns'].split(', ') : [],
        graduationYear: data['graduationYear'].toString(),
        // major: '',//data['major'],
        residence: this.residence,
        bio: this.userInfo['bio'],
        // hometown: '',//data['hometown'],
        notifications: deviceData
      }
      //facebook: this.facebookData
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        // duration: 3000,
        dismissOnPageChange: true
      });
      loader.present();
      this.profileProvider.updateUser(this.userInfo['_id'], user)
        .subscribe((res: any) => {
          this.userInfo = res;
          this.local.set('auth', this.authToken);
          this.local.set('uid', this.userInfo['_id']);
          this.local.set('userInfo', JSON.stringify(this.userInfo)).then(() => {
            loader.dismiss();
            // this.navCtrl.setRoot(TabsPage, {}, { animate: true, direction: 'forward' });
            this.gotoProfile(this.userInfo['_id']);
          });
          // console.info('updateUser res', res);
        }, error => {
          loader.dismiss();
          console.info('updateUser error', error);
        });
    });
  }

  getFbLoginStatus() {
    // this.logoutFacebook();
    this.authProvider.checkFBLoginStatus().then((res: any) => {
      // console.info('getLoginStatus res', res);
      if (res.status != 'connected') {
        this.getFbLogin();
      } else if (res.status == 'connected') {
        this.fbAuthDetail = res.authResponse;
        this.getFbDetail();
      }
    }).catch(error => {
      console.info('getLoginStatus error', error);
    })
  }

  getFbLogin() {
    this.loaderObj = this.loadingCtrl.create({
      content: "Please wait...",
      // duration: 3000,
      dismissOnPageChange: true
    });
    this.loaderObj.present();
    this.authProvider.logoutFromFB().then((response) => {
      this.authProvider.loginToFB()
        .then((res: any) => {
          // console.log('Logged into Facebook!', res);
          if (res.status == 'connected') {
            this.fbAuthDetail = res.authResponse;
            this.getFbDetail();
          }
        })
        .catch(e => { console.log('Error logging into Facebook', e); this.loaderObj.dismiss(); });
    }).catch(e => { console.log('Error logging out Facebook', e); this.loaderObj.dismiss(); });
  }

  getFbDetail() {
    this.authProvider.getFBUserDetail(this.fbAuthDetail['userID'])
      .then((res: any) => {
        // console.info('fb api res', res);
        this.detailForm.controls['firstName'].setValue(res.name.split(' ')[0]);
        this.detailForm.controls['lastName'].setValue(res.name.split(' ')[1]);
        // this.detailForm.controls['hometown'].setValue(res.hometown ? res.hometown.name : '');
        this.userInfo['hometown'] = res.hometown ? res.hometown.name : '';
        // this.userInfo['location'] = res.location ? res.location.name : '';
        this.facebookData = res;
        this.facebookData['auth'] = this.fbAuthDetail;
        // console.info('this.facebookData', this.facebookData);
        // if (!this.facebookData.likes) {
        //   this.authProvider.getUserslikes(this.fbAuthDetail['userID'])
        //     .then((likesRes: any) => {
        //       console.log('likesRes', likesRes);
        //     })
        // } else {
        //   console.log('this.facebookData', this.facebookData);
        // }
        // this.saveProfileImageToCloudinary();
        // this.swipeTo(this.currentTab + 2);
        this.loaderObj.dismiss();
        this.createNewAccount({ email: this.email, facebook: res });
      }).catch(e => {
        console.info('fb api error', e);
        this.loaderObj.dismiss();
      });
  }

  // getNextFacebookLikes(){
  //   if(this.facebookData.likes){

  //   }
  // }

  saveProfileImageToCloudinary() {
    this.cloudinaryProvider.imageLocalPath = this.facebookData.picture.data.url;
    if (this.cloudinaryProvider.imageLocalPath) {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      loader.present();
      this.cloudinaryProvider.uploadPictureFromUrl('profile-covers')
        .subscribe((data: any) => {
          let cloud_response = JSON.parse(data.response);
          // cloud_response.createdBy = this.userInfo['_id'];
          cloud_response.version = cloud_response.version.toString();
          this.userInfo['currentProfile'] = cloud_response;
          this.createNewAccount({ email: this.email, facebook: this.facebookData });
        }, error => {
          console.info('cloudinary error', error);
          loader.dismiss();
        })
    }
  }

  logoutFacebook() {
    this.authProvider.logoutFromFB().then((response) => {
      console.info('response', response);
    });
  }
  gotoProfile(uid) { this.navCtrl.setRoot('Profile', { uid: uid }, { animate: true, direction: 'forward' }); }
}


// checkOtp() {
  //   if (this.verificatioCode) {
  //     let loader = this.loadingCtrl.create({
  //       content: "Please wait...",
  //       // duration: 3000,
  //       dismissOnPageChange: true
  //     });
  //     loader.present();
  //     this.authProvider.checkCode(this.userInfo['_id'], this.verificatioCode)
  //       .subscribe((res: any) => {
  //         loader.dismiss();
  //         this.userInfo = res;
  //         this.swipeTo(2);
  //         // console.info('checkCode this.userInfo', this.userInfo);
  //       }, error => {
  //         loader.dismiss();
  //         // console.info('create error', error);
  //         if (error.status = 401) {
  //           let toast = this.toastCtrl.create({
  //             message: 'Incorrent OTP',
  //             duration: 2000,
  //             position: 'middle'
  //           });

  //           toast.present();
  //         }
  //       })
  //   }
  // }
