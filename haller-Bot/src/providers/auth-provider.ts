import { Injectable } from '@angular/core';
import { HttpClient } from "./http-client";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient) {
    // console.log('Hello AuthProvider Provider', httpClient.ApiBaseUrl);
  }

  login(postObj: any) {
    return this.http.post('login', postObj).map(this.http.extractData);
  }
  logout(userId: string) {
    return this.http.get('logout/' + userId).map(this.http.extractData);
  }
  changePassword(postObj: any) {
    return this.http.post('change-password', postObj).map(this.http.extractData);
  }
  create(postObj: any) {
    return this.http.post('users', postObj).map(this.http.extractData);
  }

}
