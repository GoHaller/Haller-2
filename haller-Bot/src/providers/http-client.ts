import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';

@Injectable()
export class HttpClient {
  private local: Storage;
  private token: string;
  private headers = new Headers();
  public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public kuEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@ku.edu$/;

  private env = 'prod-working';
  private getApiBaseUrl = () => {
    let url = 'http://10.0.0.22:4040/api/bot/';
    switch (this.env) {
      case 'stage': url = 'https://haller-api-v2.herokuapp.com/api/bot/'; break;
      case 'prod-working': url = 'https://haller-api-app-stage.herokuapp.com/api/bot/'; break;
      case 'prod': url = 'https://haller-api-v2-main.herokuapp.com/api/bot/'; break;
      default: break;
    }
    return url;
  }
  public ApiBaseUrl = this.getApiBaseUrl();

  constructor(private http: Http, storage: Storage, private alertCtrl: AlertController) {
    this.local = storage;
  }

  getActivationToken() {
    this.local.get('auth').then((val) => {
      this.token = val;
    });
  }

  createAuthorizationHeader() {
    this.headers = new Headers();
    if (this.token)
      this.headers.append('Authorization', 'Bearer:' + this.token);
  }

  get(url: string) {
    this.createAuthorizationHeader();
    return this.http.get(this.ApiBaseUrl + url, { headers: this.headers });
  }

  post(url: string, postObj: any) {
    this.createAuthorizationHeader();
    return this.http.post(this.ApiBaseUrl + url, postObj, { headers: this.headers });
  }

  extractData(res: any) {
    let body = JSON.parse(res._body);
    return body || {};
  }

  showError(error: any) {
    let body = JSON.parse(error._body);
    let prompt = this.alertCtrl.create({
      title: body.message,
      buttons: [
        {
          text: 'Ok',
          handler: data => { }
        }
      ]
    });
    prompt.present();
  }

  getDateFormate(date) {
    let d = new Date(date);
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (today.toDateString() == d.toDateString())
      return 'shortTime';
    else if (yesterday.toDateString() == d.toDateString())
      return "'Yesterday'";// h:m a";
    else
      return 'MM/dd/yyyy';
  }
}
