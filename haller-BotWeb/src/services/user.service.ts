import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

@Injectable()
export class UserService {
    private adminApiUrl: string = 'users';
    private headers = new Headers();
    public activeToken: String;
    public residenceList = [
        { name: 'Oliver Hall', value: 'Oliver Hall' },
        { name: 'Scholarship Hall', value: 'Scholarship Hall' },
        { name: 'Oswald/Self Hall', value: 'Oswald/Self Hall' },
        { name: 'Ellsworth Halls', value: 'Ellsworth Halls' },
        { name: 'Downs Hall', value: 'Downs Hall' }
    ];

    constructor(private http: Http) {
        this.adminApiUrl = environment.ApiBaseUrl + this.adminApiUrl;
        let userInfo = localStorage.getItem('userInfo');
        this.activeToken = userInfo ? JSON.parse(userInfo).status.activeToken : '';
    }


    createAuthorizationHeader() {
        this.headers = new Headers();
        if (this.activeToken) { this.headers.append('Authorization', 'Bearer:' + this.activeToken); }
    }

    getUsersListWithFilter(skip: number = 0, limit: number = 25, keyword: string = null) {
        this.createAuthorizationHeader();
        let q = '?skip=' + skip + '&limit=' + limit;
        if (keyword) { q += '&keyword=' + keyword; }
        return this.http.get(this.adminApiUrl + q, { headers: this.headers }).map(this.extractData);
    }

    private extractData(res: any) {
        return (typeof res == 'object') ? res.json() : res;
    }

    getDateFormate(date) {
        let d = new Date(date);
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (today.toDateString() == d.toDateString()) { return 'shortTime'; }
        else if (yesterday.toDateString() == d.toDateString()) { return "'Yesterday' h:m a"; }// h:m a";
        else { return 'MM/dd/yyyy h:m a'; }
    }
}