import { Injectable } from '@angular/core';
import { HttpClient } from './http-client';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProfileProvider {

    constructor(public httpClient: HttpClient) { }

    searchOrg(keyword: string) {
        return this.httpClient.get('/users/organization/' + keyword).map(this.httpClient.extractData)
        // .catch(this.httpClient.extractError);
    }

    getAllOrg() {
        return this.httpClient.get('/users/organization').map(this.httpClient.extractData)
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

    blockUser(userId: string, blockUserId: string) {
        return this.httpClient.get('/users/' + userId + '/block/' + blockUserId).map(this.httpClient.extractData)
        // .catch(this.httpClient.extractError);
    }

    getUserByResidence(userId, residence, skip, limit) {
        return this.httpClient.get('/users/' + userId + '/residence/' + residence + '?skip=' + skip + '&limit=' + limit).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    listUser(userId, skip, limit) {
        return this.httpClient.get('/users/' + userId + '/list/?skip=' + skip + '&limit=' + limit).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    serachPeers(userId, skip, limit, residence = null, searchKeyword = null) {
        let query = 'skip=' + skip + '&limit=' + limit;
        if (residence) query += '&residence=' + residence;
        if (searchKeyword) query += '&search=' + searchKeyword;
        return this.httpClient.get('/users/' + userId + '/search/?' + query).map(this.httpClient.extractData)
    }
}
