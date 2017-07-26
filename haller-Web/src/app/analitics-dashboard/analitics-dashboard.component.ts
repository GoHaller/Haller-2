import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.services';

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
  public userslist:any=[];
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getDashBoardCount();
  }
  
showNameData(days){
  this.postService.getDashBoardEventJoinners(days).subscribe((res: any) => {
        this.userslist = res.userName;
      }, error => {
        console.info('error', error);
      })

  this.showNameList=!this.showNameList;
  
}

showName(days){
  this.postService.getDashBoardEventJoinners(days).subscribe((res: any) => {
        this.users = res.userName;
      }, error => {
        console.info('error', error);
      })
  this.showDiv=!this.showDiv;
}

  getDashBoardCount() {
    this.postService.getDashBoardCount()
      .subscribe((res: any) => {
        this.countData = res;
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
