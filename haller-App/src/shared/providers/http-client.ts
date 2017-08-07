import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the HttpClient provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpClient {
  private local: Storage;
  public activeToken: String;
  // private ApiBaseUrl = 'http://192.168.0.103:4040/api';
  // private ApiBaseUrl = 'https://haller-api-v2.herokuapp.com/api';
  private ApiBaseUrl = 'https://haller-api-v2-main.herokuapp.com/api';
  //private ApiBaseUrl = 'https://haller-api-app-stage.herokuapp.com/api';
  //private ApiBaseUrl = 'https://haller-app-api.herokuapp.com/api';
  public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public kuEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@ku.edu$/;
  public userAvatar = 'assets/img/default-user.png';
  public groupAvatar = 'assets/img/user-group.png';

  private headers = new Headers();

  constructor(public http: Http) {
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then((val) => {
      let user = JSON.parse(val);
      this.activeToken = val ? user.status.activeToken : '';
    });
  }

  createAuthorizationHeader() {
    this.headers = new Headers();
    if (this.activeToken)
      this.headers.append('Authorization', 'Bearer:' + this.activeToken);
  }

  get(url) {
    this.createAuthorizationHeader();
    return this.http.get(this.ApiBaseUrl + url, { headers: this.headers });
  }

  post(url, data) {
    this.createAuthorizationHeader();
    return this.http.post(this.ApiBaseUrl + url, data, { headers: this.headers });
  }

  put(url, data) {
    this.createAuthorizationHeader();
    return this.http.put(this.ApiBaseUrl + url, data, { headers: this.headers });
  }

  delete(url) {
    this.createAuthorizationHeader();
    return this.http.delete(this.ApiBaseUrl + url, { headers: this.headers });
  }

  extractData(res: any) {
    let body = JSON.parse(res._body);
    return body || {};
  }

  getFromOutSide(url: string) {
    return this.http.get(url);
  }

  extractError(error: any) {
    // error['_body'] = JSON.parse(error['_body']);
    return error;
    // In a real world app, we might use a remote logging infrastructure
    // console.info('actual error', error);
    // let errMsg: string;
    // if (error) {
    //   const body = JSON.parse(error._body);
    //   const err = body.error || JSON.stringify(body);
    //   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    // } else {
    //   errMsg = error.message ? error.message : error.toString();
    // }
    // // console.error(errMsg);
    // return errMsg;
  }

  convertToMSJSON(objDate: Date) {
    var date = '/Date(' + objDate.getTime() + ')/'; //CHANGED LINE
    return date;
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
      return 'yy/M/d';
  }

  getProfileImageToDisplay(user) {
    // console.info('user', user);
    if (user && user.currentProfile)
      return user.currentProfile.secure_url || this.userAvatar;
    else if (user && user.facebook && user.facebook.picture && user.facebook.picture.data)
      return user.facebook.picture.data.url || this.userAvatar;
    else
      return this.userAvatar;
  }

}
