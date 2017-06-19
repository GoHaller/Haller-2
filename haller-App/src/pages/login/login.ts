import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
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
    private formBuilder: FormBuilder, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });
    this.local = new Storage('localstorage');
  }

  ionViewDidLoad() { }
  loginClicked(data) {
    this.loginProvider.login({ email: data.email, password: data.password }).subscribe((res: any) => {
      console.info('login res',res);
      this.local.set('auth', res.token);
      this.local.set('uid', res.user._id);
      this.local.set('userInfo', JSON.stringify(res.user)).then(() => {
        this.navCtrl.setRoot('Tabs', {}, { animate: true, direction: 'forward' });
      });
    }, error => {
      console.info('error', error);
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

}
