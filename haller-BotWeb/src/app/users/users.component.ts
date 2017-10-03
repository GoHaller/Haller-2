import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';

declare interface UserDataTable {
    dataRows: string[][];
}
declare var $: any;
var table = null;
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    public dataTable: any;
    public editUser: any = {};
    search = ''; skip = 0; limit = 10;
    recordsTotal = 0; users: any = [];
    Math: any;

    constructor(public userService: UserService, private modalService: ModalService) {
        this.Math = Math;
    }
    ngOnInit() { this.getUserList(); }
    getUserList() {
        this.userService.getUsersListWithFilter(this.skip, this.limit, this.search)
            .subscribe((res: any) => { this.users = res; this.recordsTotal = this.users[0]['total'] }, err => { console.log('err', err); });
    }
    clearFilter() { this.search = ''; this.skip = 0; this.getUserList(); }
    setFilter() { this.skip = 0; this.getUserList(); }

    changeThePage(next, pre) {
        if (next) { this.skip += this.limit; }
        if (pre) { this.skip -= this.limit; }
        this.getUserList();
    }
    pageCountChange() {
        this.skip = 0;
        this.getUserList();
    }
}
