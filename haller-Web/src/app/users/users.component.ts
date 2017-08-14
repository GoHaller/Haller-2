import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../../services/user.service';

declare interface UserDataTable {
  dataRows: string[][];
}
declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public dataTable: any;
  constructor(public userService: UserService) { }

  ngOnInit() {
    console.log(`${environment.ApiBaseUrl}`);
    this.dataTable = {
      dataRows: [
        // ['http://via.placeholder.com/50x50', 'Andrew Mike', 'Residence Hall', 'Student', 'Senior', '24', '50', '14', '2', '4', '14'],
        // ['http://via.placeholder.com/50x50', 'John Doe', 'Residence Hall', 'Student', 'Senior', '24', '50', '14', '2', '4', '14'],
        // ['http://via.placeholder.com/50x50', 'Alex Mike', 'Residence Hall', 'Student', 'Senior', '24', '50', '14', '2', '4', '14']
      ]
    };
  }

  ngAfterViewInit() {
    var table = $('#datatables').DataTable({
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
          console.info('getAllUsers error', error);
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
        { "data": "graduationYear","mRender": function (data, type, row) { 
                   var todayYear = new Date();
                   var year = todayYear.getFullYear()+1;
                   if (year == row.graduationYear) {
                                  return "Senior"
                                  } else if((year+1)==row.graduationYear){
                                          return "Junior"
                                          }
                                    else if((year+2)==row.graduationYear) {
                                          return "Sophomores"
                                    }
                                    else if((year+3)==row.graduationYear) {
                                          return "FreshMan"
                                    }
                                    else{
                                         return "Not Specifield"
                                    }     
                                  }
         },
         { "data": "postcount"},
         { "data": "eventcount"},
         { "data": "commentavg"},
         { "data": "covercount"},
       
        { "data": "role", "mRender": function (data, type, row) { 
                   if (row.isRA) {
                                  return "RA"
                                  } else {
                                          return "Student"
                                          }
                                       }
         },
        {
          "data": "action", "mRender": function (data, type, row) {
            if (row.isBlocked) {
              var actionhtml = '<div class="row"><div class="col-sm-7"><button type="button" rel="tooltip" class="btn btn-success block btn-sm" data-status=0 data-id="' + row.id + '" ">UnBlock</button></div><div class="col-sm-3"></div></div>';
            
            } else {
              var actionhtml = '<div class="row"><div class="col-sm-3"><button type="button" rel="tooltip" class="btn btn-danger  block btn-sm" data-status=1 data-id="' + row.id + '" ">Block</button></div><div class="col-sm-3"></div></div>';
            }
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
    // table.on('click', '.edit', function () {
    //   var $tr = $(this).closest('tr');

    //   var data = table.row($tr).data();
    //   alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
    // });

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
    // });

    // //  Activate the tooltips
    // $('[rel="tooltip"]').tooltip();
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
}
