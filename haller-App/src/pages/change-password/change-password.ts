import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder } from '@angular/forms';
import { LoginProvider } from '../login/login.provider';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePassword {

  public authForm: any;
  private local: Storage;
  public uid: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public alertCtrl: AlertController, private loginProvider: LoginProvider, public toastCtrl: ToastController) {
    this.local = new Storage('localstorage');
    this.local.get('uid').then(val => {
      this.uid = val;
    })
    //Validators.compose([Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    this.authForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      newPassword: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });
  }

  ionViewDidLoad() { }

  submitForm(data) {
    this.loginProvider.changePassword(this.uid, data.password, data.newPassword)
      .subscribe((res: any) => {
        // console.info('changePassword res', res);
        if (res._id == this.uid) {
          this.navCtrl.pop();
        }
      }, e => {
        // console.info('changePassword error', e);
        if (e.status = 401) {
          let toast = this.toastCtrl.create({
            message: 'Authention fail!',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      });
  }

}