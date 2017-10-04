import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

@Injectable()
export class AuthService {
    private authApiUrl: string = 'auth/';
    constructor(private http: Http) {
        this.authApiUrl = environment.ApiBaseUrl + this.authApiUrl;
    }

    login(userObj: any) {
        return this.http.post(this.authApiUrl + 'admin/login', userObj).map(this.extractData);
    }

    adminlogin(userObj: any) {
        return this.http.post(environment.ApiBaseUrl + 'adminlogin', userObj).map(this.extractData);
    }
    logout(userId) {
        return this.http.get(environment.ApiBaseUrl + 'logout/'+userId).map(this.extractData);
    }
    forgotRequest(email: any) {

        return this.http.post(this.authApiUrl + 'sendmail', email).map(this.extractData);
    }
    passwordChanged(passwordobj: any) {

        return this.http.post(this.authApiUrl + 'resetpassword', passwordobj).map(this.extractData);
    }
    private extractData(res: Response) {
        return (typeof res == 'object') ? res.json() : res;
    }
}