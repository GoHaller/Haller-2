import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../../services/user.service';
import { ModalService } from "services/modal.service";

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
    search: any = {};
    skip: number = 0;
    limit: number = 5;
    userData: any = { recordsTotal: 0 };
    Math: any;
    years: any = [];
    public residence: string = '';
    invitedCodeDetails: any = {};
    isUserFormEditable: Boolean = false;
    public residenceListForUser = [
        { name: 'Oliver Hall', value: 'Oliver Hall' },
        { name: 'Scholarship Hall', value: 'Scholarship Hall' },
        { name: 'Oswald/Self Hall', value: 'Self Hall' },
        { name: 'Ellsworth Halls', value: 'Ellsworth Halls' },
        { name: 'Downs Hall', value: 'Downs Hall' }
    ];
    public residenceListForSearch = [
        { name: 'All Residence', value: '' },
        { name: 'Oliver Hall', value: 'Oliver' },
        { name: 'Scholarship Hall', value: 'Scholarship Hall' },
        { name: 'Oswald/Self Hall', value: 'Self Hall' },
        { name: 'Ellsworth Halls', value: 'Ellsworth Halls' },
        { name: 'Downs Hall', value: 'Downs Hall' }
    ];
    accountTypeList = [{ name: 'All Account', value: '' }, { name: 'Student', value: 'student' },
    { name: 'RA', value: 'ra' }, { name: 'Staff', value: 'staff' }]
    studentLevel = [{ name: 'Not Specified', value: '' }, { name: 'Freshman', value: 'freshman' },
    { name: 'Sophomore', value: 'sophomore' }, { name: 'Junior', value: 'junior' }, { name: 'Senior', value: 'senior' }]

    constructor(public userService: UserService, private modalService: ModalService) {
        this.Math = Math;
        let yr = new Date().getFullYear() + 1;
        this.years = [yr, yr + 1, yr + 2, yr + 3, yr + 4, yr + 5, yr + 6];
    }

    ngOnInit() {
        // console.log(`${environment.ApiBaseUrl}`);
        this.dataTable = {
            dataRows: [
                // ['http://via.placeholder.com/50x50', 'Andrew Mike', 'Residence Hall', 'Student', 'Senior', '24', '50', '14', '2', '4', '14'],
                // ['http://via.placeholder.com/50x50', 'John Doe', 'Residence Hall', 'Student', 'Senior', '24', '50', '14', '2', '4', '14'],
                // ['http://via.placeholder.com/50x50', 'Alex Mike', 'Residence Hall', 'Student', 'Senior', '24', '50', '14', '2', '4', '14']
            ]
        };
        setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
        }, 200);
        this.getInviteCOdeStatus();
    }
    makeUserFormEditable() {
        this.isUserFormEditable = true;
        setTimeout(() => {
            $('#edit-graduation-year').selectpicker('refresh');
            $('#edit-residence').selectpicker('refresh');
        }, 200);
    }

    clickOnInviteCodeStatus() {
        this.openModal('invite-code-status');
        this.getInviteCOdeStatus();
    }

    getInviteCOdeStatus() {
        this.userService.getInviteCOdeStatus()
            .subscribe((res: any) => {
                this.invitedCodeDetails = res;
            }, (error: any) => {
                console.log('error', error)
            })
    }
    openModal(id: string) {
        this.modalService.open(id);
    }
    closeModal(id: string) {
        this.isUserFormEditable = false;
        this.modalService.close(id);
    }
    save(model, isValid, id) {
        // this.closeModal(id);
        console.log('model', model);
    }
    ngAfterViewInit() {
        this.getUserList();
    }

    changeThePage(next, pre) {
        if (next) { this.skip += this.limit; }
        if (pre) { this.skip -= this.limit; }
        this.getUserList();
    }
    pageCountChange() {
        this.skip = 0;
        this.getUserList();
    }

    clearFilter() {
        this.search = { search: '', residence: '', account: '', level: '' };
        this.skip = 0;
        setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
            this.getUserList();
        }, 100);
    }
    setFilter() {
        this.skip = 0;
        this.getUserList();
    }

    getUserList() {
        this.userService.getUsersListWithFilter(this.skip, this.limit, this.search.search, this.search.residence,
            this.search.account, this.search.level).subscribe((res: any) => {
                // console.log('res', res);
                this.userData = res;
            }, err => {
                console.log('err', err);
            })
    }

    setUpDatTable() {
        table = $('#datatables').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, 1000], [10, 25, 50, "All"]],
            responsive: true,
            serverSide: true,
            bProcessing: true,
            ajax: (data, callback, settings) => {
                let usersList = this.userService.getAllUsers(data);
                usersList.subscribe((res: any) => {
                    if (res) {
                        this.dataTable.dataRows = res.data;
                        var gotData = res;
                        gotData.draw = data.draw;
                        gotData = this.proceesDataForDataTable(gotData);
                        callback(gotData);
                    }
                }, error => {
                    console.log('getAllUsers error', error);
                })
            },
            columns: [
                {
                    "data": "currentProfile.secure_url", "mRender": function (data, type, row) {
                        if (row.currentProfile.secure_url) {
                            var img = '<img style="width:75px" class="img" src="' + row.currentProfile.secure_url + '">'
                        } else {
                            var img = '<i class="material-icons" style="font-size: 50px;padding: 3px 11px;">person</i>'
                        }
                        return img;
                    }
                },
                {
                    "data": "lastName", "mRender": function (data, type, row) {
                        return row.firstName + ' ' + row.lastName;
                    }
                },
                { "data": "residence" },
                {
                    "data": "graduationYear", "mRender": function (data, type, row) {
                        var todayYear = new Date();
                        var year = todayYear.getFullYear() + 1;
                        if (year == row.graduationYear) {
                            return "Senior"
                        } else if ((year + 1) == row.graduationYear) {
                            return "Junior"
                        }
                        else if ((year + 2) == row.graduationYear) {
                            return "Sophomores"
                        }
                        else if ((year + 3) == row.graduationYear) {
                            return "FreshMan"
                        }
                        else {
                            return "N/A"
                        }
                    }
                },
                { "data": "postcount" },
                { "data": "eventcount" },
                { "data": "commentavg" },
                { "data": "covercount" },
                {
                    "data": "role", "mRender": function (data, type, row) {
                        if (row.isRA && row.role.toLowerCase() == 'student') {
                            return "RA"
                        } else if (row.role.toLowerCase() == 'student') {
                            return "Student";
                        } else {
                            return row.role.toLowerCase() == 'admin' ? "Admin" : "Staff";
                        }
                    }
                },
                {
                    "data": "action", "mRender": function (data, type, row) {
                        var actionhtml = '<div class="row">';
                        if (row.role != 'admin') {
                            if (row.isBlocked) {
                                actionhtml += '<div class="col-sm-6"><button type="button" rel="tooltip" class="btn btn-success block btn-sm" data-status=0 data-id="' + row._id + '" ">UnBlock</button></div>';
                            } else {
                                actionhtml += '<div class="col-sm-6"><button type="button" rel="tooltip" class="btn btn-danger block btn-sm" data-status=1 data-id="' + row._id + '" ">Block</button></div>';
                            }
                        }
                        if (row.role == 'student')
                            actionhtml += '<div class="col-sm-6"><button type="button" rel="tooltip" class="btn btn-success edit btn-sm" data-status=1 data-id="' + row._id + '" ">Edit</button></div>';
                        else
                            actionhtml += '<div class="col-sm-6"></div>';
                        actionhtml += '</div>'
                        return actionhtml;
                    }
                }
            ],
            initComplete: function (settings, json) {
                // alert('DataTables has finished its initialisation.');
            },
            drawCallback: function (settings) {
                // alert('DataTables has redrawn the table');
            },
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
            }

        });

        //var table = $('#datatables').DataTable();

        // Edit record
        table.on('click', '.edit', (e) => {
            var $tr = $(e.currentTarget).closest('tr');
            var data = table.row($tr).data();
            // console.log('data', data);
            this.editUser = data || {};
            this.openModal('edit-user-form');
            this.residence = this.editUser['residence'];
            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 500);
            // alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
        });

        // // Delete a record
        table.on('click', '.block', (e) => {
            var $userId = $(e.currentTarget).data('id');
            var $status = $(e.currentTarget).data('status');
            this.userService.toggleStatus($userId, $status).subscribe((res: any) => {
                table.ajax.reload(null, false);
            }, error => {
                console.info('toggleStatus error', error);
            });
        });

        // //Like record
        // table.on('click', '.like', function () {
        //   alert('You clicked on Like button');
        // var $tr = $(this).closest('tr');
        // var data = table.row($tr).data();
        // });

        // //  Activate the tooltips
        // $('[rel="tooltip"]').tooltip();
    }

    blockUser(user) {
        this.userService.toggleStatus(user._id, user.isBlocked == 0 ? 1 : 0).subscribe((res: any) => {
            // table.ajax.reload(null, false);
            this.getUserList();
        }, error => {
            console.log('toggleStatus error', error);
        });
    }
    editUserFn(user) {
        this.editUser = JSON.parse(JSON.stringify(user));
        this.openModal('edit-user-form');
        // this.residence = this.editUser['residence'];
        // setTimeout(() => {
        //     $('#edit-graduation-year').selectpicker('refresh');
        //     $('#edit-residence').selectpicker('refresh');
        // }, 800);
    }

    getStudentLevel(graduationYear) {
        var year = new Date().getFullYear() + 1;
        if (year == graduationYear) {
            return "Senior"
        } else if ((year + 1) == graduationYear) {
            return "Junior"
        }
        else if ((year + 2) == graduationYear) {
            return "Sophomores"
        }
        else if ((year + 3) == graduationYear) {
            return "Freshman"
        }
        else {
            return "N/A"
        }
    }

    getAccountType(isRA, role) {
        if (isRA && role.toLowerCase() == 'student') {
            return "RA"
        } else if (role.toLowerCase() == 'student') {
            return "Student";
        } else {
            return role.toLowerCase() == 'admin' ? "Admin" : "Staff";
        }
    }

    proceesDataForDataTable(data) {
        data.data.forEach(element => {
            element.action = 'demo';
            if (element.currentProfile) {

            } else {
                element.currentProfile = {};
                element.currentProfile.secure_url = '';
            }
        });
        return data;
    }

    updateUser() {
        this.closeModal('edit-user-form')
        let userObj = { isRA: this.editUser.isRA, residence: this.editUser.residence, hometown: this.editUser.hometown };
        userObj['graduationYear'] = this.editUser.graduationYear;
        userObj['major'] = this.editUser.major;
        this.userService.updateUser(this.editUser._id, userObj)
            .subscribe((res: any) => {
                // $('#datatables').ajax.reload(null, false);
                // table.ajax.reload(null, false);
                this.getUserList();
            }, error => {
                console.log('getAllUsers error', error);
            })
    }

    getInviteCodeExcelData() {
        this.userService.getInviteCodeExcelData()
            .subscribe((res: any) => {
                let excelData = [];
                res.forEach(data => {
                    let excelCell = {};
                    let d = new Date(data.createdAt);
                    excelCell['Access Code'] = data.inviteCode;
                    excelCell['First Name'] = data.firstName;
                    excelCell['Last Name'] = data.lastName;
                    excelCell['Date of Account Creation'] = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
                    let h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
                    let am_pm = d.getHours() >= 12 ? 'PM' : 'AM';
                    let m = d.getMinutes();
                    excelCell['Time of Account Creation'] = (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m) + ' ' + am_pm;
                    excelCell['Residence Hall'] = data.residence;
                    excelData.push(excelCell);
                });
                console.log('excelData',excelData);
                let date = new Date();
                let d = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                this.JSONToCSVConvertor(excelData, 'Invite Codes', true, 'haller-invite-code-' + d + '.csv');
            }, error => {
                console.log('error', error);
            })
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
        console.log('CSV', CSV);
        let csv = CSV;
        let blob = new Blob([csv], { type: 'application/csv' });
        let csvUrl = (window as any).webkitURL.createObjectURL(blob);
        // var filename = 'UserExport.csv';
        link.setAttribute('download', filename);
        link.setAttribute('href', csvUrl);
        link.click();
        // $('#lnkDwnldLnk').attr({ 'download': filename, 'href': csvUrl });
        // $('#lnkDwnldLnk')[0].click();
        document.body.removeChild(link);
    }
    s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}
