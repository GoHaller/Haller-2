import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthProvider } from "../../providers/auth-provider";
// $IMPORTSTATEMENT

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePassword {
  local: Storage;
  public authForm: any;
  public userInfo: any = { _id: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private authProvider: AuthProvider, storage: Storage, public alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
    this.local = storage;
    this.authForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
       repassword: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      passwordnew: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    },{ validator: ChangePassword.passwordsMatch });
  }

  ionViewDidLoad() {
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      // console.log('ionViewDidLoad ChangePassword', this.userInfo);
    });
  }

  static passwordsMatch(cg: FormGroup): { [err: string]: any } {
    let pwd1 = cg.get('password');
    let pwd2 = cg.get('repassword');
    let rv: { [error: string]: any } = {};
    if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
      rv['passwordMismatch'] = true;
    }
    return rv;
  }

  submitForm(data) {

    if (data.passwordnew.length >= 8) {
      let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
      loader.present();
      data['id'] = this.userInfo['_id'];
      this.authProvider.changePassword(data)
        .subscribe((res: any) => {
          loader.dismiss();
          if (res._id) { this.passwordChanged(); }
          this.authForm.reset();
        }, (error: any) => {
          loader.dismiss();
          this.authForm.reset();
          this.authProvider.http.showError(error);
        }, () => {
          this.authForm.reset();
        })
    } else {
      this.paswwordValidation();
    }
  }

  paswwordValidation() {
    let prompt = this.alertCtrl.create({
      title: 'Passwords must be 8 characters long',
      buttons: [{ text: 'Ok', handler: data => { } }]
    });
    prompt.present();
  }

  passwordChanged() {
    let prompt = this.alertCtrl.create({
      title: 'Your password has been updated',
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
