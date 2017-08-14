import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    test: Date = new Date();
    userObj: any = { email: "", password: "" };

    constructor(private authService: AuthService, private router: Router) {
        if (localStorage.getItem('uid'))
            this.router.navigate(['/analitics-dashboard']);
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
        // localStorage.setItem('todos', 'JSON.stringify($scope.todos)');
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
            // let saved = localStorage.getItem('todos');
            // console.info('saved', saved);
        }, 700)
    }

    onLogin() {
        this.authService.login(this.userObj)
            .subscribe((res: any) => {
                console.info('login res', res);
                if (res.token) {
                    localStorage.setItem('auth', res.token);
                    localStorage.setItem('uid', res.user.id);
                    localStorage.setItem('userInfo', JSON.stringify(res.user));
                    this.router.navigate(['/analytics-dashboard']);
                    //analitics-dashboard
                }
            }, error => {
                console.info('login error', error);
            })
    }
}
