import { Injectable } from '@angular/core';
import { HttpClient } from '../../shared/providers/http-client';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProfileEditProvider {

    constructor(public httpClient: HttpClient) { }

    searchOrg(keyword: string) {
        return this.httpClient.get('/users/organization/' + keyword).map(this.httpClient.extractData)
        // .catch(this.httpClient.extractError);
    }

    updateUser(userId, userObject) {
        return this.httpClient.put('/users/' + userId, userObject).map(this.httpClient.extractData)
        // .catch(this.httpClient.extractError);
    }

    getBlockedUsers(userId) {
        return this.httpClient.get('/users/' + userId + '/blocklist').map(this.httpClient.extractData)
        // .catch(this.httpClient.extractError);
    }

    getInterestList(keyword: string) {
        return this.httpClient.get('/users/interest/' + keyword).map(this.httpClient.extractData)
    }
}
