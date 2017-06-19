import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';

import { RegistrationProvider } from "./registration.provider";
import { ProfileEditProvider } from "../profile-edit/profile-edit.provider";
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

  @ViewChild(Slides) slides: Slides;
  private local: Storage;
  private userInfo: Object = {};
  private verificatioCode: string = '';
  private authToken: string = '';
  private authForm: any;
  private detailForm: any;
  private currentTab: number;
  private showResidenceOption: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private regProvider: RegistrationProvider,
    private profileEditProvider: ProfileEditProvider, private formBuilder: FormBuilder, public toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {
    this.local = new Storage('localstorage');
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(50), Validators.pattern(profileEditProvider.httpClient.emailRegex), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });

    this.detailForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      pronouns: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      major: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      graduationYear: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });
  }

  ionViewDidLoad() {
    //, this.navParams.data
    console.info('ionViewDidLoad Registration');
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

  selectResidence(residence) {
    this.userInfo['residence'] = residence;
    this.showResidenceOption = false;
  }

  createAccount(data) {
    if (data['email'] && data['password']) {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        // duration: 3000,
        dismissOnPageChange: true
      });
      loader.present();
      this.regProvider.create(data)
        .subscribe((res: any) => {
          loader.dismiss();
          if (res.user) {
            this.userInfo = res.user;
            this.authToken = res.token;
            this.swipeTo(1);
          } else if (res['_id']) {
            let toast = this.toastCtrl.create({
              message: 'Try with another email',
              duration: 2000,
              position: 'middle'
            });

            toast.present();
          }
          // console.info('create this.userInfo', this.userInfo);
        }, error => {
          loader.dismiss();
          console.info('create error', error);
        })
    }
  }

  checkOtp() {
    if (this.verificatioCode) {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        // duration: 3000,
        dismissOnPageChange: true
      });
      loader.present();
      this.regProvider.checkCode(this.userInfo['_id'], this.verificatioCode)
        .subscribe((res: any) => {
          loader.dismiss();
          this.userInfo = res;
          this.swipeTo(2);
          // console.info('checkCode this.userInfo', this.userInfo);
        }, error => {
          loader.dismiss();
          // console.info('create error', error);
          if (error.status = 401) {
            let toast = this.toastCtrl.create({
              message: 'Incorrent OTP',
              duration: 2000,
              position: 'middle'
            });

            toast.present();
          }
        })
    }
  }

  finishRegistration(data) {
    let user = {
      firstName: data['firstName'],
      lastName: data['lastName'],
      genderPronouns: data['pronouns'].split(', '),
      graduationYear: data['graduationYear'],
      major: data['major'],
      residence: this.userInfo['residence'],
      bio: this.userInfo['bio'],
      hometown: this.userInfo['hometown'],
    }
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      // duration: 3000,
      dismissOnPageChange: true
    });
    loader.present();
    this.profileEditProvider.updateUser(this.userInfo['_id'], user)
      .subscribe((res: any) => {
        this.userInfo = res;
        this.local.set('auth', this.authToken);
        this.local.set('uid', this.userInfo['_id']);
        this.local.set('userInfo', JSON.stringify(this.userInfo)).then(() => {
          loader.dismiss();
          this.navCtrl.setRoot('Tabs', {}, { animate: true, direction: 'forward' });
        });
        // console.info('updateUser res', res);
      }, error => {
        loader.dismiss();
        console.info('updateUser error', error);
      });

  }

}
