import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html',
    styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
    public password: any;
    public cpassword: any;
    public passwordMisMatch: Boolean = false;
    public EmailSend: Boolean = false;

    constructor(private authService: AuthService, private _router: Router) { }

    ngOnInit() {
    }
    save(dd: any) {
        console.log("ddddddd", dd);
    }
    emailChange(passwordonj: any) {
        let currentUrl = (this._router.url).split("/");
        var token = currentUrl.length - 1;
        passwordonj.token = currentUrl[token]
        if (passwordonj.password == passwordonj.cpassword) {
            this.authService.passwordChanged(passwordonj).subscribe((res: any) => {
                this.EmailSend = true;
                setTimeout(() => {
                    this._router.navigate(['/login']);
                }, 1000);

            }, error => {
                console.log('forgoterror error', error);
            })
        }
        else {
            this.passwordMisMatch = true;
        }
    }
}
