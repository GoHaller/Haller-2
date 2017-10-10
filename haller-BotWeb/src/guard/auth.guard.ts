import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private http: Http) {
        let userInfo = localStorage.getItem('adminInfo');
        this.activeToken = userInfo ? JSON.parse(userInfo).status.activeToken : '';
    }
    private headers = new Headers();
    public activeToken: String;

    createAuthorizationHeader() {
        this.headers = new Headers();
        if (this.activeToken) { this.headers.append('Authorization', 'Bearer:' + this.activeToken); }
    }
    getById(userId) {
        this.createAuthorizationHeader();
        return this.http.get(environment.ApiBaseUrl + '/users/' + userId, { headers: this.headers }).map(this.extractDataBody);
    }
    private extractDataBody(res: any) {
        let body = JSON.parse(res._body);
        return body || null;
    }

    canActivate(): any {
        if (localStorage.getItem('adminInfo')) {
            this.createAuthorizationHeader();
            return this.http.get(environment.ApiBaseUrl + '/users/' + localStorage.getItem('adminid'), { headers: this.headers }).
                map(auth  => {
                    if (this.extractDataBody(auth) != null) {
                        return true;
                    }
                    this.router.navigate(['/login']);
                    return false;
                })
        }
        else {
            this.router.navigate(['/login']);
            return false;
        }

    }
}
