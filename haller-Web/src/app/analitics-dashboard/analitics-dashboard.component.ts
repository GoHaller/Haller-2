import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.services';
import { ModalService } from '../../services/modal.service';
import {Ng2PaginationModule} from 'ng2-pagination';
import { EventJoinComponent } from "../modal/eventJoin.component";
@Component({
  selector: 'app-analitics-dashboard',
  templateUrl: './analitics-dashboard.component.html',
  styleUrls: ['./analitics-dashboard.component.css']
})
export class AnaliticsDashboardComponent implements OnInit {

  public baseUrl: string = 'none';
  public countData: any;
  public showCaseData: any = {};
  public showDiv:boolean=false;
  public showNameList:boolean=false;
  public users:any= [];
  public eventType: string = 'none';

  public staffCount:any = [];
  public staffJoinerCount:any =[];
 
  public id;


  constructor(private postService: PostService, private modalService: ModalService) { }

  ngOnInit() {
    this.getDashBoardCount();
  }
  

showEventUserName(days){
  this.postService.getDashBoardEventJoinners(days).subscribe((res: any) => {
       this.users =res.userName;
       this.eventType = "Event Joiners";
       this.modalService.open("EventJoinner"); 
      }, error => {
        console.info('error', error);
      })
  
}

showStaffUserName(days){
    this.postService.getDashBoardStaffEventJoinners(days).subscribe((res: any) => {
       this.users = res.userName;
       this.eventType = "Staff Event Joiners";
       this.modalService.open("EventJoinner");  
      }, error => {
        console.info('error', error);
      })
  
}

  closeModal(id: string) {
    this.modalService.close(id);
  }

  getDashBoardCount() {
    this.postService.getDashBoardCount()
      .subscribe((res: any) => {
        this.countData = res;
        this.staffCount[0]= res['twoDayStaffCount']
        this.staffCount[1]= res['threeDayStaffCount']

        this.staffJoinerCount[0]= res['twoDayStaffJoiner']
        this.staffJoinerCount[1]= res['threeDayStaffJoiner'] 

        res['threeDays'].forEach(three => {
          if (!this.showCaseData['72']) this.showCaseData['72'] = {};
          if (three._id) {
            this.showCaseData['72'].event = three.count;
            for(var i =0;i<this.countData.threeDays.length;i++){
                if(this.countData.threeDays[i]._id == true){
                  this.showCaseData['72'].going = this.countData.threeDays[i].goingCount;
                }
            }
          } else {
            this.showCaseData['72'].feed = three.count;
          }
        });
        res['towDays'].forEach(three => {
          if (!this.showCaseData['24']) this.showCaseData['24'] = {};
          if (three._id) {
            this.showCaseData['24'].event = three.count;

            for(var i =0;i<this.countData.towDays.length;i++){
                if(this.countData.threeDays[i]._id == true){
                  this.showCaseData['24'].going = this.countData.towDays[i].goingCount;
                }
            }
          } else {
            this.showCaseData['24'].feed = three.count;
          }
        });
      }, error => {
        console.info('error', error);
      })
  }
}
