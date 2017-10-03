import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthProvider } from "../../providers/auth-provider";
// $IMPORTSTATEMENT

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class Registration {
  public authForm: any;
  public loginForm: any;
  section: number = 0;//0=login,1=reg
  local: Storage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private authProvider: AuthProvider, storage: Storage, public alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.authForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      password1: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    }, { validator: Registration.passwordsMatch });

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });

    this.local = storage;
  }

  static passwordsMatch(cg: FormGroup): { [err: string]: any } {
    let pwd1 = cg.get('password');
    let pwd2 = cg.get('password1');
    let rv: { [error: string]: any } = {};
    if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
      rv['passwordMismatch'] = true;
    }
    return rv;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad Registration');
  }

  regClicked(data) {
    if (this.authProvider.http.kuEmailRegex.test(data.email)) {
      if (data.password.length >= 8) {
        let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
        loader.present();
        this.local.get('fcm-data').then((val) => {
          if (val) {
            let fcmData = JSON.parse(val);
            data['notifications'] = { deviceToken: fcmData.deviceData.token, os: fcmData.deviceData.os }
          }
          this.authProvider.create(data)
            .subscribe((res: any) => {
              loader.dismiss();
              this.afertRegistration(res);
            }, error => {
              loader.dismiss();
              this.authProvider.http.showError(error);
            }, () => { })
        });
      } else {
        this.paswwordValidation();
      }
    } else {
      this.emailValidation();
    }
  }

  loginClicked(data) {
    let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    loader.present();
    this.authProvider.login(data)
      .subscribe((res: any) => {
        loader.dismiss();
        this.afterLogin(res);
      }, error => {
        loader.dismiss();
        this.authProvider.http.showError(error);
      }, () => {
        console.log('complete');
      })
  }

  afterLogin(res) {
    let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    loader.present();
    this.local.set('auth', res.token);
    this.local.set('uid', res.user._id);
    this.local.set('userInfo', JSON.stringify(res.user)).then(() => {
      this.local.get('fcm-data').then((val) => {
        if (val) {
          let fcmData = JSON.parse(val);
          let data = { deviceToken: fcmData.deviceData.token, os: fcmData.deviceData.os }
          this.authProvider.update({ userId: res.user._id, notifications: data })
            .subscribe((user: any) => {
              this.local.set('userInfo', JSON.stringify(user)).then(() => { })
              loader.dismiss();
              this.gotoChatBotPage();
            }, error => {
              loader.dismiss();
              this.gotoChatBotPage();
            })
        } else {
          loader.dismiss();
          this.gotoChatBotPage()
        }
      });
    });
  }

  gotoChatBotPage() {
    this.navCtrl.setRoot('Chatbot', {}, { animate: true, direction: 'forward' });
  }

  afertRegistration(res) {
    this.local.set('auth', res.token);
    this.local.set('uid', res.user._id);
    this.local.set('userInfo', JSON.stringify(res.user)).then(() => {
      this.navCtrl.setRoot('Chatbot', {}, { animate: true, direction: 'forward' });
    });
  }

  paswwordValidation() {
    let prompt = this.alertCtrl.create({
      title: 'Passwords must be 8 characters long',
      buttons: [{ text: 'Ok', handler: data => { } }]
    });
    prompt.present();
  }

  emailValidation() {
    let prompt = this.alertCtrl.create({
      title: 'Please enter a valid ku email address.',
      buttons: [{ text: 'Ok', handler: data => { } }]
    });
    prompt.present();
  }

}
