import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

@Injectable()
export class UserService {
    private adminApiUrl: string = 'users/admin/';
    private headers = new Headers();
    public activeToken: String;

    constructor(private http: Http) {
        this.adminApiUrl = environment.ApiBaseUrl + this.adminApiUrl;
        let userInfo = localStorage.getItem('userInfo');
        this.activeToken = userInfo ? JSON.parse(userInfo).status.activeToken : '';
    }


    createAuthorizationHeader() {
        this.headers = new Headers();
        if (this.activeToken)
            this.headers.append('Authorization', 'Bearer:' + this.activeToken);
    }

    getAllUsers(queryParams: any) {
        this.createAuthorizationHeader();
        return this.http.post(this.adminApiUrl + localStorage.getItem('uid') + '/list', queryParams, { headers: this.headers }).map(this.extractData);
    }

    toggleStatus(userId: any, sataus: any) {
        this.createAuthorizationHeader();
        return this.http.post(this.adminApiUrl + 'change-user-sataus', { userId: userId, sataus: sataus }, { headers: this.headers }).map(this.extractData);
    }

    private extractData(res: any) {
        return (typeof res == 'object') ? res.json() : res;
    }
}