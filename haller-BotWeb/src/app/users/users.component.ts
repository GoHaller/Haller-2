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
            .subscribe((res: any) => {
                this.users = res; this.recordsTotal = this.users[0]['total']
            }, err => { console.log('err', err); });
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
    getUserAnalytics() {
        this.userService.getUserAnalytics().subscribe(
            response => {
                let excelData = [];
                for (var i = 0; i < response.users.length; i++) {
                    for (var j = 0; j < response.users[i].analyticsMsg.bot.length; j++) {
                        let excelCell = {};
                        let d = new Date(response.users[i].analyticsMsg.bot[j].createdAt);
                        let h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
                        let am_pm = d.getHours() >= 12 ? 'PM' : 'AM';
                        let m = d.getMinutes();
                        let s = d.getSeconds();
                        excelCell['User Name'] = response.users[i].firstName;
                        if (response.users[i]._id == response.users[i].analyticsMsg.bot[j].createdBy) {
                            excelCell['From'] = response.users[i].firstName;
                            excelCell['To'] = "Bot";
                        }
                        else {
                            excelCell['From'] = "Bot";
                            excelCell['To'] = response.users[i].firstName;
                        }
                        excelCell['Date'] = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
                        excelCell['Time'] = (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m) + ':'+(s < 10 ? ('0' + s) : s) + ' ' +  am_pm;
                        excelData.push(excelCell);
                    }
                }
                //console.log('excelData', excelData);
                let date = new Date();
                let fd = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                this.JSONToCSVConvertor(excelData, 'User Analytics', true, 'haller-useranalytics-' + fd + '.csv');
            }
        )
    }

    JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel, filename) {
        // If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        let CSV = '';
        // This condition will generate the Label/Header
        if (ShowLabel) {
            let row = '';

            // This loop will extract the label from 1st index of on array
            for (let index in arrData[0]) {
                // Now convert each value to string and comma-seprated
                row += index + ',';
            }
            row = row.slice(0, -1);
            // append Label row with line break
            CSV += row + '\r\n';
        }

        // 1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = '';
            // 2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            // add a line break after each row
            CSV += row + '\r\n';
        }
        if (CSV == '') {
            alert('Invalid data');
            return;
        }
        // this trick will generate a temp "a" tag
        let link = document.createElement('a');
        link.id = 'lnkDwnldLnk';
        // this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        //console.log('CSV', CSV);
        let csv = CSV;
        let blob = new Blob([csv], { type: 'application/csv' });
        let csvUrl = (window as any).webkitURL.createObjectURL(blob);
        // var filename = 'UserExport.csv';
        link.setAttribute('download', filename);
        link.setAttribute('href', csvUrl);
        link.click();
        document.body.removeChild(link);
    }
}
