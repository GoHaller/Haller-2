import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;
declare var swal: any;
@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    test: Date = new Date();
    email: string;
    password: string;

    constructor(private authService: AuthService,
        private router: Router) { }

    login() {
        var userObj =
            {
                email: this.email,
                password: this.password
            }
        this.authService.adminlogin(userObj).subscribe(
            response => {
                localStorage.setItem('adminInfo', JSON.stringify(response.user));
                localStorage.setItem('adminid', response.user._id);
                localStorage.setItem('adminauth', response.token);
                this.router.navigate(['/users']);
            }, error => {
                var errormsg = JSON.parse(error._body);
                console.info('login error', errormsg.message);
                
        swal({
            text: errormsg.message,
            type: 'error',
            showCancelButton: false,
            showConfirmButton: true
        })
            })
    }

    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };
    ngOnInit() {
        this.checkFullPageBackgroundImage();

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }
}
