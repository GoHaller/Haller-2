import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

declare var $: any;
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    constructor(private elRef: ElementRef, private router: Router, private location: Location) { }
    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            body.classList.add("perfect-scrollbar-on");
        } else {
            body.classList.add("perfect-scrollbar-off");
        }
        $.material.init();
        var titlee = this.location.prepareExternalUrl(this.location.path());
        var title = titlee.split("/")
        var status = false;
        for(var i=0; i<title.length;i++){
            if(title[i] == "forgotpassword" && title[i+1]){
                status = true;
            }
        }
        if (localStorage.getItem('uid')) {
            if (titlee == 'login')
                this.router.navigate(['/analitics-dashboard']);
        }else if(status){
            this.router.navigate([titlee]);
        }
         else {
            this.router.navigate(['/login']);
        }
    }
}
