import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.services';
import {Ng2PaginationModule} from 'ng2-pagination';

declare var $: any;
declare var swal:any;

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

  deletePost(postid:any){ 
    this.postService.deletePostApi(postid).subscribe((res: any) => { 
          console.log("got fronted response"); 
           
           }, error => {
                   console.info('error', error);    
                     })
  }
  selectPost(index){    
    this.postIndex = index;  
 }
 showSwal(postid:any){
             swal({
                    title: '',
                    text: "Are you sure want to delete this post?",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    confirmButtonText: 'Yes, delete it!',
                    buttonsStyling: false
                }).then(() => {               
            this.deletePost(postid) 
            swal({         
                  title: 'Deleted!',
                  text: 'Post has been deleted.',      
                  type: 'success',  
                  confirmButtonClass: "btn btn-success",
                  buttonsStyling: false
               })
 });
 }
  deleteComment(postId, commentId){ 
    if(postId && commentId){
        this.postService.deleteCommentApi(postId, commentId).subscribe((res: any) => { 
          console.log("got fronted response");     
           }, error => {
                   console.info('error', error);    
                     })
    }
  }
  
  

}
