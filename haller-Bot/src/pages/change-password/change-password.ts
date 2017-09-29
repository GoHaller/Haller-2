import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
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
    private authProvider: AuthProvider, storage: Storage, public alertCtrl: AlertController) {
    this.local = storage;
    this.authForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      passwordnew: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      // console.log('ionViewDidLoad ChangePassword', this.userInfo);
    });
  }

  submitForm(data) {
    if (data.passwordnew.length >= 8) {
      data['id'] = this.userInfo['_id'];
      this.authProvider.changePassword(data)
        .subscribe((res: any) => {
          if (res._id) {
            this.passwordChanged();
          }
          this.authForm.reset();
        }, (error: any) => {
          this.authForm.reset();
          this.authProvider.http.showError(error);
          // let error1 = this.authProvider.httpClient.extractData(error);
          // this.showError(error1.message);
        }, () => {
          this.authForm.reset();
          console.log('complete');
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
