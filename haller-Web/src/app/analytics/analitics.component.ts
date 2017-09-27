import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { Ng2PaginationModule } from 'ng2-pagination';
import { EventJoinComponent } from "../modal/eventJoin.component";
import * as Chartist from 'chartist';
declare var $: any;
@Component({
    selector: 'app-analitics',
    templateUrl: './analitics.component.html',
    styleUrls: ['./analitics.component.css']
})
export class AnaliticsComponent implements OnInit {

    analyticsData: any = {};

    constructor(private userService: UserService, private modalService: ModalService, private zone: NgZone, private cdrf: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.getAnalytics();
    }

    getAnalytics() {
        this.userService.getStudentAnalytics()
            .subscribe((res: any) => {
                this.analyticsData = res;
                console.log('res', res);
            }, error => {
                console.log('error', error);
            })
    }

    ngAfterViewInit() { }

    getTimeThatUserSent(userId, data) {
        let dates = [];
        if (data) {
            data.forEach(msg => {
                if (msg.createdBy == userId) {
                    dates.push(this.getFormatedDate(msg.createdAt));
                }
            });
        }
        return dates.join('<br/>');
    }

    getTimeThatBotSent(userId, data) {
        let dates = [];
        if (data) {
            data.forEach(msg => {
                if (msg.createdBy != userId) {
                    dates.push(this.getFormatedDate(msg.createdAt));
                }
            });
        }
        return dates.join('<br/>');
    }

    getFormatedDate(createdAt) {
        let d = new Date(createdAt);
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
    }
}
