import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../shared/providers/auth.provider';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePassword {

  public authForm: any;
  public createPassForm: any;
  private local: Storage;
  public uid: string = '';
  public userInfo: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public alertCtrl: AlertController, private authProvider: AuthProvider, public toastCtrl: ToastController) {
    this.local = new Storage('localstorage');
    this.local.get('uid').then(val => {
      this.uid = val;
    });
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
    });
    //Validators.compose([Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    this.authForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      newPassword: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });

    //create new password form
    this.createPassForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      cPassword: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    }, { validator: this.checkIfMatchingPasswords('password', 'cPassword') });
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() { }

  submitForm(data) {
    this.authProvider.changePassword(this.uid, data.password, data.newPassword)
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

  submitCreateForm(data) {
    this.authProvider.createPassword(this.uid, data.password)
      .subscribe((res: any) => {
        // console.info('changePassword res', res);
        if (res._id == this.uid) {
          this.local.set('userInfo', JSON.stringify(res)).then(() => {
            this.navCtrl.pop();
          });
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
