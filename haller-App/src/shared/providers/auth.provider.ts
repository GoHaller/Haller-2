import { Injectable } from '@angular/core';
import { HttpClient } from './http-client';
import 'rxjs/add/operator/catch';
// import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { Facebook } from "@ionic-native/facebook";

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public httpClient: HttpClient, private fb: Facebook) { }

  login(postData: Object) {
    return this.httpClient.post('/auth/login', postData).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  logout(userId: String) {
    return this.httpClient.get('/auth/logout/' + userId).map(this.httpClient.extractData);
    // .catch(this.httpClient.extractError);
  }

  changePassword(userId: string, oldPwd: string, newPwd: string) {
    return this.httpClient.put('/auth/' + userId + '/password', { 'password': oldPwd, 'newPassword': newPwd })
    .map(this.httpClient.extractData);
  }

  createPassword(userId: string, Pwd: string) {
    return this.httpClient.put('/auth/' + userId + '/create-password', { 'password': Pwd })
    .map(this.httpClient.extractData);
  }

  create(userData: Object) {
    return this.httpClient.post('/users', userData).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  checkCode(userId: string, otp: string) {
    return this.httpClient.get('/users/' + userId + '/otp/' + otp).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  checkInviteCode(invitecode: string) {
    return this.httpClient.post('/auth/check-invite-code/', { code: invitecode }).map(this.httpClient.extractData)
  }

  checkFBLoginStatus() {
    return this.fb.getLoginStatus();
  }

  loginToFB() {
    return this.fb.login(['user_hometown', 'user_location', 'user_likes', 'user_birthday'])
  }

  logoutFromFB() {
    return this.fb.logout();
  }

  getFBUserDetail(fbUserID: string) {
    // console.info('fb userID', this.fbAuthDetail);
    // this.fb.api(this.fbAuthDetail['userID'] + '/?field=id,email,first_name,last_name', [])
    // this.fb.api(this.fbAuthDetail['userID'] + '/movies', [])
    return this.fb.api(fbUserID + '/?fields=id,name,picture.type(large),email,hometown,birthday,location,likes.limit(500)', [])
  }

  getUserslikes(fbUserID: string) {
    return this.fb.api(fbUserID + '/likes.limit(500)', [])
  }

  getUsersPermission(fbUserID:string){
    return this.fb.api(fbUserID + '/permissions', [])
  }

  getUniversityData() {
    return this.httpClient.get('/users/university/5985d5d53bf71dd7b17db2be')
      .map(this.httpClient.extractData);
  }
}
