import { Injectable } from '@angular/core';
import { HttpClient } from '../../shared/providers/http-client';
import 'rxjs/add/operator/catch';

@Injectable()
export class RegistrationProvider {

    constructor(public httpClient: HttpClient) {
        console.log('Hello Registration Provider');
    }

    create(userData: Object) {
        return this.httpClient.post('/users', userData).map(this.httpClient.extractData)
            // .catch(this.httpClient.extractError);
    }

    checkCode(userId: string, otp: string) {
        return this.httpClient.get('/users/' + userId + '/otp/' + otp).map(this.httpClient.extractData)
            // .catch(this.httpClient.extractError);
    }

}
