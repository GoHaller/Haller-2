import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

@Injectable()
export class UserService {
    private adminApiUrl: string = 'users/admin/';
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
        if (this.activeToken)
            this.headers.append('Authorization', 'Bearer:' + this.activeToken);
    }

    getUsersListWithFilter(skip: number = 0, limit: number = 25, search: string = null, residence: string = null,
        account: string = null, level: string = null) {
        // let { skip = 0, limit = 25, search = null, residence = null, account = null } = req.query;
        this.createAuthorizationHeader();
        let q = 'skip=' + skip + '&limit=' + limit;
        if (search) { q += '&search=' + search; }
        if (residence) { q += '&residence=' + residence; }
        if (account) { q += '&account=' + account; }
        if (level) { q += '&level=' + level; }
        return this.http.get(this.adminApiUrl + localStorage.getItem('uid') + '/list?' + q, { headers: this.headers })
            .map(this.extractData);
    }

    getAllUsers(queryParams: any) {
        this.createAuthorizationHeader();
        return this.http.post(this.adminApiUrl + localStorage.getItem('uid') + '/list', queryParams,
            { headers: this.headers }).map(this.extractData);
    }

    toggleStatus(userId: any, sataus: any) {
        this.createAuthorizationHeader();
        return this.http.post(this.adminApiUrl + 'change-user-sataus', { userId: userId, sataus: sataus }, { headers: this.headers }).map(this.extractData);
    }

    updateUser(userId, userObject) {
        this.createAuthorizationHeader();
        return this.http.put(environment.ApiBaseUrl + 'users/' + userId, userObject, { headers: this.headers }).map(this.extractData)
        // .catch(this.httpClient.extractError);
    }

    getBotUser(email) {
        this.createAuthorizationHeader();
        return this.http.get(environment.ApiBaseUrl + 'users/bot/' + email, { headers: this.headers }).map(this.extractData);
    }

    getConversationForRecipient(userId, recipientId, bot = false) {
        this.createAuthorizationHeader();
        let q = (recipientId ? ('?recipient=' + recipientId) : '');
        if (q.length == 0) { q = '?'; } else { q = q + '&'; }
        q = q + 'bot=' + bot;
        return this.http.get(environment.ApiBaseUrl + 'conversations/users/' + userId + q, { headers: this.headers }).map(this.extractData)
    }

    getUsesrWhoTalkWith(userId: string, search: string = null) {
        this.createAuthorizationHeader();
        // return this.http.get(environment.ApiBaseUrl + 'users/' + userId + '/getusesrwhotalkwith', 
        // { headers: this.headers }).map(this.extractData);
        let q = '';
        if (search) {
            q = '?search=' + search;
        }
        return this.http.get(environment.ApiBaseUrl + 'users/botconversation' + q,
            { headers: this.headers }).map(this.extractData);
    }
    ///:userId/getusesrwhotalkwith

    replyAsBot(conversationId, recipient, createdBy, body) {
        let obj = { recipient: recipient, createdBy: createdBy, body: body };
        this.createAuthorizationHeader();
        return this.http.post(environment.ApiBaseUrl + 'conversations/' + conversationId + '/bot', obj,
            { headers: this.headers }).map(this.extractData)
    }

    massReplyAsBot(allStudent, residence, createdBy, body) {
        let obj = { allStudent: allStudent, residence: residence, createdBy: createdBy, body: body };
        this.createAuthorizationHeader();
        return this.http.post(environment.ApiBaseUrl + 'conversations/bot-mass-reply', obj,
            { headers: this.headers }).map(this.extractData)
    }

    getStudentAnalytics() {
        return this.http.get(environment.ApiBaseUrl + 'users/analytics', { headers: this.headers }).map(this.extractData)
    }

    getInviteCOdeStatus() {
        this.createAuthorizationHeader();
        return this.http.get(this.adminApiUrl + 'invite-code-status', { headers: this.headers }).map(this.extractData)
    }

    getInviteCodeExcelData() {
        this.createAuthorizationHeader();
        return this.http.get(this.adminApiUrl + 'invite-code-status-excel', { headers: this.headers }).map(this.extractData)
    }

    private extractData(res: any) {
        return (typeof res == 'object') ? res.json() : res;
    }

    getDateFormate(date) {
        let d = new Date(date);
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (today.toDateString() == d.toDateString())
            return 'shortTime';
        else if (yesterday.toDateString() == d.toDateString())
            return "'Yesterday' h:m a";// h:m a";
        else
            return 'MM/dd/yyyy h:m a';
    }
}