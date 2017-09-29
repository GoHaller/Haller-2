import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController } from 'ionic-angular';
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
    private authProvider: AuthProvider, storage: Storage, public alertCtrl: AlertController) {
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
    // console.log('password', this.authForm.controls.password);
    // console.log(data);
    // this.navCtrl.setRoot('Chatbot', {}, { animate: true, direction: 'forward' });
    if (data.password.length >= 8) {
      this.authProvider.create(data)
        .subscribe((res: any) => {
          this.afertRegLogin(res);
        }, error => {
          this.authProvider.http.showError(error);
        }, () => {
          console.log('complete');
        })
    } else {
      this.paswwordValidation();
    }
  }

  loginClicked(data) {
    this.authProvider.login(data)
      .subscribe((res: any) => {
        this.afertRegLogin(res);
      }, error => {
        this.authProvider.http.showError(error);
      }, () => {
        console.log('complete');
      })
  }

  afertRegLogin(res) {
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

  showError(errorMessage: string) {
    let prompt = this.alertCtrl.create({
      title: errorMessage,
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
