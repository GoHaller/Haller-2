import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.services';
import {Ng2PaginationModule} from 'ng2-pagination';

declare var $: any;

@Component({
  selector: 'app-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.css']
})
export class FlagComponent implements OnInit {
  public section: string = 'feed';
  public sort: any = 0;
  public postIndex: number = 0;
  public posts = [];
  public postid='';  
  public flagOfthree=false;  
  public noFurtureAction=false;
  constructor(private postService: PostService) { }

  ngOnInit() {
    $('.comment-section').perfectScrollbar();
    this.getFeeds();
    if ($(".selectpicker").length != 0) {
      $(".selectpicker").selectpicker();
    }
  }

  getFeeds() {
    this.postService.getFlagedData(this.section, this.sort).subscribe((res: any) => {
      // console.info('getFlagedData error', res);
      if (res)
        this.posts = res;
        if(this.sort==1)
                {           
                  this.flagOfthree=true;
                }
                else{
                     this.flagOfthree=false;
                    }
                if(this.sort==3)
                {
                   this.noFurtureAction=true;
                }
                else{
                   this.noFurtureAction=false; 
                   }

    }, error => {
      console.info('getFlagedData error', error);
    })
  }

  flagAction(action, postId, commentId = null) {
    let obj = { action: action };
    if (commentId)
      obj['commentId'] = commentId;
    console.info('action', action, postId, commentId);
    this.postService.flaggedAction(postId, obj)
      .subscribe((res: any) => {
        for (var index = 0; index < this.posts.length; index++) {
          if (this.posts[index]._id == postId) {
            this.posts[index] = res;
          }
        }
        // console.info('flaggedAction error', res);
      }, error => {
        console.info('flaggedAction error', error);
      })
  }
  deletePost(postid:any)  
  { 
     console.log("post id",postid); 
  }

}
