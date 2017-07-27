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
  public users:any=[];
  public staffCount:any = [];
 
  public id;
  public listuser=[];

  constructor(private postService: PostService, private modalService: ModalService) { }

  ngOnInit() {
    this.getDashBoardCount();
  }
  
showNameData(days){
  this.postService.getDashBoardEventJoinners(days).subscribe((res: any) => {
        this.listuser = res.userName;
      }, error => {
        console.info('error', error);
      })
  this.modalService.open("Eventinseventytwo");
  //this.showNameList=!this.showNameList;
  
}

showName(days){
  this.postService.getDashBoardEventJoinners(days).subscribe((res: any) => {
       this.users = res.userName;
      }, error => {
        console.info('error', error);
      })
  this.modalService.open("EventJoinner");
  //this.showDiv=!this.showDiv;
}


  closeModal(id: string) {
    this.modalService.close(id);
   
  }

  getDashBoardCount() {
    this.postService.getDashBoardCount()
      .subscribe((res: any) => {
        this.countData = res;
        this.staffCount[0]= res['TwoDayStaffCount']
        this.staffCount[1]= res['threeDayStaffCount'] 

        res['threeDays'].forEach(three => {
          if (!this.showCaseData['72']) this.showCaseData['72'] = {};
          if (three._id) {
            this.showCaseData['72'].event = three.count;
            this.showCaseData['72'].going = three.goingCount;
          } else {
            this.showCaseData['72'].feed = three.count;
          }
        });
        res['towDays'].forEach(three => {
          if (!this.showCaseData['24']) this.showCaseData['24'] = {};
          if (three._id) {
            this.showCaseData['24'].event = three.count;
            this.showCaseData['24'].going = three.goingCount;
          } else {
            this.showCaseData['24'].feed = three.count;
          }
        });
      }, error => {
        console.info('error', error);
      })
  }

}
