import { Injectable } from '@angular/core';
import { HttpClient } from '../../shared/providers/http-client'
import 'rxjs/add/operator/catch';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PeersProvider {

    constructor(public httpClient: HttpClient) {
        console.log('Hello Peers Provider');
    }

    getUserByResidence(userId, residence, skip, limit) {
        return this.httpClient.get('/users/' + userId + '/residence/' + residence + '?skip=' + skip + '&limit=' + limit).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    listUser(userId, skip, limit) {
        return this.httpClient.get('/users/' + userId + '/list/?skip=' + skip + '&limit=' + limit).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }
}