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

    constructor(private userService: UserService, private modalService: ModalService, private zone: NgZone, private cdrf: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.getAnalytics();
    }

    getAnalytics() {
        this.userService.getStudentAnalytics()
            .subscribe((res: any) => {
                console.log('res', res);
            }, error => {
                console.log('error', error);
            })
    }

    ngAfterViewInit() { }
}
