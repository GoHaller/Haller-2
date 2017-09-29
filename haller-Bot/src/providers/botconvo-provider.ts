import { Injectable } from '@angular/core';
import { HttpClient } from "./http-client";
import 'rxjs/add/operator/map';

/*
  Generated class for the BotconvoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BotconvoProvider {

  constructor(public http: HttpClient) {
  }

  getBotData() {
    return this.http.get('').map(this.http.extractData);
  }

  getConversation(userId: string) {
    return this.http.get('convo/' + userId).map(this.http.extractData);
  }

  askToBot(userId: string, postObj: any) {
    return this.http.post('convo/' + userId, postObj).map(this.http.extractData);
  }

}
