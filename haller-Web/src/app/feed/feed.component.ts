import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { PostService } from '../../services/post.services';
import {Ng2PaginationModule} from 'ng2-pagination';


declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public isEvent: boolean = false;
  public post: any = {};
  public comment: any = {};
  public detail: any;
  public posts = [];
  public postIndex: number = 0;
  public residence: any = { home: 'Oliver' };

  file: File;
  ngOnInit() {
    // console.info('posts', this.posts);
    $('.comment-section').perfectScrollbar();
    this.getFeeds();
    if ($(".selectpicker").length != 0) {
      $(".selectpicker").selectpicker();
    }
  }
  constructor(private location: Location, private modalService: ModalService, public postService: PostService) {
    let title = this.location.prepareExternalUrl(this.location.path());
    this.isEvent = title.indexOf('event') > -1;
  }

  save(model, isValid, id) {
    this.closeModal(id);
  }

  openModal(id: string) {
    this.modalService.open(id);
    setTimeout(() => {
      // console.info("$('.datetimepicker')", $('.datetimepicker').length);
      if ($('.datetimepicker').length) {
        $('.datetimepicker').datetimepicker({
          icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove',
            done: 'fa fa-check'
          }
        });
      }

    }, 500);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.file = null;
    this.post = { details: '', image: null };
    this.comment = { details: '', image: null };
  }

  setImage(files) {
    this.post.image = files;
  }

  handleInputFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.file = files[0];
    this.post['image'] = this.file['result'];
    // console.log(this.file);
  }

  removeImage() {
    this.file = null;
  }

  selectPost(index) {
    this.postIndex = index;
  }

  handleDateChange(event) {
    console.info('event.target', event.target.value);
  }

  getFeeds() {
    this.postService.getFeedByResidence(this.residence.home, this.isEvent).subscribe((res: any) => {
      if (res)
        this.posts = res;
    }, error => {
      console.info('getFeedByResidence error', error);
    })
  }

  addPost(model, isValid, id) {
    // console.info('model', model);
    // console.info('this.post', this.post);
    // console.info("$('.datetimepicker')", $('#eventDate').data("DateTimePicker").date()._d)
    if (isValid) {
      this.modalService.close(id);
      this.detail = model.details;
      if (this.file && this.file.size) {
        this.postService.cloudinaryUpload(this.file['result'], 'profile-covers')
          .subscribe((res: any) => {
            console.info('cloudinaryUpload res', res);
            if (id == 'new-feed-form')
              this.createPostToApi(res);
            else if (id == 'new-feed-comment-form')
              this.createCommentApi(res);
          }, error => {
            console.info('cloudinaryUpload error', error);
          });
      } else {
        if (id == 'new-feed-form')
          this.createPostToApi(null);
        else if (id == 'new-feed-comment-form')
          this.createCommentApi(null);
      }
    }
  }

  createPostToApi(cloudinaryResponse = null) {
    let feedObject = {};
    if (cloudinaryResponse) {
      cloudinaryResponse.createdBy = localStorage.getItem('uid');
      cloudinaryResponse.version = cloudinaryResponse.version.toString();
      feedObject['cover'] = [cloudinaryResponse];
    }
    feedObject['createdAt'] = new Date();
    feedObject['createdBy'] = localStorage.getItem('uid');
    feedObject['title'] = 'Haller';
    feedObject['authorResidence'] = 'University';
    feedObject['discoveryFeed'] = true;
    feedObject['residentsFeed'] = false;
    feedObject['details'] = this.detail;
    feedObject['isEvent'] = this.isEvent;
    if (this.isEvent) {
      feedObject['date'] = $('#eventDate').data("DateTimePicker").date()._d;
      feedObject['location'] = this.post.location;
      feedObject['title'] = this.post.title;
    }
    this.postService.createPost(feedObject)
      .subscribe((res: any) => {
        console.info('createPOst res', res);
        this.file = null;
        this.post.detail = '';
        this.getFeeds();
      }, error => {
        console.info('error', error);
      });
  }

  createCommentApi(cloudinaryResponse = null) {
    let commentObj = {
      createdBy: localStorage.getItem('uid'),
      body: this.detail,
      createdAt: new Date()
    };

    if (cloudinaryResponse) {
      cloudinaryResponse.createdBy = localStorage.getItem('uid');
      cloudinaryResponse.version = cloudinaryResponse.version.toString();
      commentObj['image'] = cloudinaryResponse;
    }

    this.postService.createComment(this.posts[this.postIndex]._id, commentObj)
      .subscribe((res: any) => {
        console.info('createComment res', res);
        this.file = null;
        this.posts[this.postIndex] = res;
      }, error => {
        console.info('createComment error', error);
      })
  }

  likePost(feed) {
    this.postService.likeFeed(feed, localStorage.getItem('uid'))
      .subscribe((res: any) => {
        let index = this.posts.indexOf(feed);
        this.posts[index] = res;
      }, error => {
        console.info('likeFeed error', error);
      });
  }

  likeComment(comment) {
    let userId = localStorage.getItem('uid');
    let flagObj = comment.liked.filter(like => { return (like.actedBy._id == userId) || (like.actedBy === userId); })[0];
    if (flagObj) {
      this.postService.deleteLikeComment(this.posts[this.postIndex]['_id'], comment['_id'], flagObj['_id'])
        .subscribe((res: any) => {
          this.posts[this.postIndex] = this.postService.processFeed(res);
        }, error => {
          console.info('deleteLikeComment error', error);
        });
    } else {
      this.postService.likeComment(this.posts[this.postIndex]['_id'], comment['_id'], { actedBy: userId, actionType: 'like' })
        .subscribe((res: any) => {
          this.posts[this.postIndex] = this.postService.processFeed(res);
        }, error => {
          console.info('likeComment error', error);
        });
    }
  }

}
