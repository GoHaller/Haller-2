import { Injectable } from '@angular/core';
import { HttpClient } from '../../shared/providers/http-client';
import 'rxjs/add/operator/catch';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {

  constructor(public httpClient: HttpClient) {
    console.log('Hello Login Provider');
  }

  login(postData: Object) {
    return this.httpClient.post('/auth/login', postData).map(this.httpClient.extractData)
      .catch(this.httpClient.extractError);
  }

  logout(userId: String) {
    return this.httpClient.get('/auth/logout/' + userId)
      .catch(this.httpClient.extractError);
  }

  changePassword(userId: string, oldPwd: string, newPwd: string) {
    return this.httpClient.put('/auth/' + userId + '/password', { 'password': oldPwd, 'newPassword': newPwd })
      .map(this.httpClient.extractData);
  }
}
