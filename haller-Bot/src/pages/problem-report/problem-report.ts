import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
  selector: 'page-problem-report',
  templateUrl: 'problem-report.html',
})
export class ProblemReport {

  private problemForm: any;
  private local: Storage;
  private uid: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private httpClient: HttpClient, public toastCtrl: ToastController, storage: Storage) {
    this.local = storage;
    this.problemForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
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
        let toast = this.toastCtrl.create({
          message: 'Your issue has been reported. Thank you.',
          duration: 5000,
          position: 'top'
        });
        toast.present();
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
    return this.httpClient.post('report-problem/' + this.uid, probObject).map(this.httpClient.extractData);
  }

}
