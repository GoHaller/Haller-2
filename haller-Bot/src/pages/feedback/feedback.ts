import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '../../providers/http-client';
import 'rxjs/add/operator/catch';

/**
 * Generated class for the ProblemReport page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class Feedback {

  problemForm: any;
  private local: Storage;
  private uid: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private httpClient: HttpClient, public toastCtrl: ToastController, storage: Storage, public alertCtrl: AlertController) {
    this.local = storage;
    this.problemForm = this.formBuilder.group({
      description: ['', Validators.compose([Validators.maxLength(500), Validators.required])]
    });
  }

  goBack() { this.navCtrl.pop(); }

  ionViewDidLoad() {
    this.local.get('uid').then(val => {
      this.uid = val;
    });
  }

  submitProblemForm(data) {
    this.sendProblem(data)
      .subscribe((res: any) => {
        let prompt = this.alertCtrl.create({
          title: 'Your feedback has been submitted. Thank you. Your feedback is valuable to us.',
          buttons: ['Ok']
        });
        prompt.present();
        this.navCtrl.pop();
      }, error => {
        let toast = this.toastCtrl.create({
          message: 'Please try later',
          duration: 5000,
          position: 'top'
        });
        toast.present();
        console.info('sendProblem error', error);
      })
  }

  sendProblem(probObject: Object) {
    return this.httpClient.post('feedback/' + this.uid, probObject).map(this.httpClient.extractData);
  }

}
