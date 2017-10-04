import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

@Injectable()
export class NotificationService {
    private notificationApiUrl: string = 'notification/';
    private headers = new Headers();
    public activeToken: String;
    private userId: string = localStorage.getItem('adminid');

    constructor(private http: Http) {
        this.notificationApiUrl = environment.ApiBaseUrl + this.notificationApiUrl;
        let userInfo = localStorage.getItem('adminInfo');
        this.activeToken = userInfo ? JSON.parse(userInfo).status.activeToken : '';
    }

    createAuthorizationHeader() {
        this.headers = new Headers();
        if (this.activeToken) { this.headers.append('Authorization', 'Bearer:' + this.activeToken); }
    }

    createNotification(notificationObj: any) {
        this.createAuthorizationHeader();
        return this.http.post(this.notificationApiUrl + 'createnew', notificationObj, { headers: this.headers }).map(this.extractData)
    }

    getNotification(userId: string) {
        this.createAuthorizationHeader();
        return this.http.get(this.notificationApiUrl + 'by/' + userId, { headers: this.headers }).map(this.extractData);
    }

    getUsersForNotification() {
        this.createAuthorizationHeader();
        return this.http.get(environment.ApiBaseUrl + 'users/users-for-notification', { headers: this.headers })
            .map(this.extractData);
    }

    private extractData(res: any) {
        return (typeof res == 'object') ? res.json() : res;
    }
}