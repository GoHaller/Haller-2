import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { TabsPage } from "../tabs/tabs";

@IonicPage()
@Component({
  selector: 'page-feed-detail',
  templateUrl: 'feed-detail.html',
})
export class FeedDetail {

  private local: Storage;
  public userInfo: Object = {};
  public feed: Object = {};
  public feedId: string = '';
  public commentContent: String;
  public commentId: String = null;
  public localImage: String = null;
  public refresher: any;
  public userAvatar = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public feedProvider: FeedProvider,
    private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController,
    private event: Events) {
    this.local = new Storage('localstorage');
    this.userAvatar = feedProvider.httpClient.userAvatar;

    this.feed = navParams.get('feed') || {};
    if (this.feed) this.feedId = this.feed['_id'];
    this.feedId = navParams.get('feedId') || this.feedId;
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.feedProvider.userId = this.userInfo['_id'];
      if (this.feedId) {
        this.getFeedDetail();
      }
      let notificationId = this.navParams.get('notificationId') || null;
      this.markNotificationAsRead(notificationId);
    });
    this.event.subscribe('notification:feeddetail', (feedId, notificationId) => {
      this.feedId = feedId;
      this.getFeedDetail();
      this.markNotificationAsRead(notificationId);
    });
  }

  doRefresh(refresher) {
    if (this.feedId) {
      this.getFeedDetail();
      this.refresher = refresher;
    } else {
      refresher.complete();
    }
  }

  markNotificationAsRead(notificationId) {
    if (notificationId) {
      this.feedProvider.markNotificationAsRead(notificationId, this.userInfo['_id'])
        .subscribe((res: any) => { }, error => { console.info('error', error); });
    }
  }

  ionViewDidLoad() {

  }

  getFeedDetail() {
    this.feedProvider.getFeed(this.feedId)
      .subscribe((res: any) => {
        this.feed = this.feedProvider.processFeed(res);
        if (this.refresher) {
          this.refresher.complete();
          this.refresher = null;
        }
      }, err => {
        console.info('error', err);
      })
  }

  removeImage() {
    this.localImage = null;
    this.feedProvider.cloudinaryProvider.imageLocalPath = null;
    this.feedProvider.cloudinaryProvider.gif = {};
  }

  viewFullImage(image) {
    this.feedProvider.viewFullImage(image);
  }

  starFeed(feed) {
    this.feedProvider.starFeed(feed)
      .subscribe((res: any) => {
        this.feed = this.feedProvider.processFeed(res);
        // console.info('starPost res', res);
      }, error => {
        console.info('starPost error', error);
      })
  }

  likeFeed(feed) {
    this.feedProvider.likeFeed(feed)
      .subscribe((res: any) => {
        this.feed = this.feedProvider.processFeed(res);
        // console.info('likeFeed res', res);
      }, error => {
        console.info('likeFeed error', error);
      })
  }

  goBack() {
    if (this.navCtrl.length() > 1) {
      let resolver = this.navParams.get('resolve');
      if (resolver) resolver(this.feed);
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  //Comment Section
  postComment() {
    if (this.commentContent) {
      this.feedProvider.submitComment(this.feed['_id'], this.commentContent, this.commentId)
        .subscribe((observ: any) => {
          observ.subscribe((res: any) => {
            this.feed = this.feedProvider.processFeed(res);
            this.commentContent = '';
            this.commentId = null;
            this.removeImage();
          }, error => {
            console.info('error', error);
          })
        }, error => {
          console.info('error', error);
        })
    }
  }

  newCommentChange(event) {
    let ele = event.target;
    let row = ele.rows;
    if (ele.clientHeight < ele.scrollHeight && row < 6) {
      row += 1;
    }
    ele.rows = row;
  }

  takePicture() {
    this.feedProvider.cloudinaryProvider.presentActionSheet();
  }

  getCommentDateFormatr(date) {
    return this.feedProvider.httpClient.getDateFormate(date);
  }

  presentCommentOption(comment) {
    let flagObj = comment.flagged.filter(flagged => {
      return (flagged.actedBy._id == this.userInfo['_id']) || (flagged.actedBy === this.userInfo['_id']);
    })[0];
    let options = [];

    if (comment.createdBy._id == this.userInfo['_id']) {
      options.push({ text: 'Edit', handler: () => { this.commentContent = comment.body; this.commentId = comment._id; } });
      options.push({ text: 'Delete', handler: () => { this.confirmCommentDeletion(comment); } });
    } else {
      options.push({ text: flagObj ? 'Un-Flag' : 'Flag', handler: () => { this.flagComment(comment); } });
    }
    let actionSheet = this.actionSheetCtrl.create({
      buttons: options
    });
    actionSheet.present();
  }

  flagComment(comment) {
    let flagObj = comment.flagged.filter(flagged => {
      return (flagged.actedBy._id == this.userInfo['_id']) || (flagged.actedBy === this.userInfo['_id']);
    })[0];
    if (flagObj) {
      this.feedProvider.deleteFlagComment(this.feed['_id'], comment['_id'], flagObj['_id'])
        .subscribe((res: any) => {
          this.feed = this.feedProvider.processFeed(res);
        }, error => {
          console.info('deleteFlagComment error', error);
        });
    } else {
      this.feedProvider.flagComment(this.feed['_id'], comment['_id'], { actedBy: this.userInfo['_id'], actionType: 'flag' })
        .subscribe((res: any) => {
          this.feed = this.feedProvider.processFeed(res);
        }, error => {
          console.info('flagComment error', error);
        });
    }
  }

  isCommentLiked(comment) {
    let flagObj = comment.liked.filter(like => { return (like.actedBy._id == this.userInfo['_id']) || (like.actedBy === this.userInfo['_id']); })[0];
    if (flagObj) return true; else return false;
  }

  likeComment(comment) {
    let flagObj = comment.liked.filter(like => { return (like.actedBy._id == this.userInfo['_id']) || (like.actedBy === this.userInfo['_id']); })[0];
    if (flagObj) {
      this.feedProvider.deleteLikeComment(this.feed['_id'], comment['_id'], flagObj['_id'])
        .subscribe((res: any) => {
          this.feed = this.feedProvider.processFeed(res);
        }, error => {
          console.info('deleteLikeComment error', error);
        });
    } else {
      this.feedProvider.likeComment(this.feed['_id'], comment['_id'], { actedBy: this.userInfo['_id'], actionType: 'like' })
        .subscribe((res: any) => {
          this.feed = this.feedProvider.processFeed(res);
        }, error => {
          console.info('likeComment error', error);
        });
    }
  }

  confirmCommentDeletion(comment) {
    let options = [];
    options.push({
      text: 'Delete', handler: () => {
        this.feedProvider.deleteComment(this.feed['_id'], comment['_id'])
          .subscribe((res: any) => {
            // console.info('res', res);
            this.feed = this.feedProvider.processFeed(res);
          })
      }
    });
    options.push({ text: 'No', handler: () => { } });
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Leaving Event?',
      buttons: options
    });
    actionSheet.present();
  }

  //Redirection
  gotoEditFeed(feed) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('FeedNew', { feed: feed, resolve: resolve }, { animate: true, direction: 'forward' })
    }).then(data => {
      if (data['_id'] == feed['_id'])
        this.feed = data;
    });
  }

  gotoEditEvent(event) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('EventNew', { event: event, resolve: resolve }, { animate: true, direction: 'forward' })
    }).then(data => {
      if (data['_id'] == event['_id'])
        this.feed = data;
    });
  }

  presentFeedActionSheet(feed) {
    let options = [];
    options.push({ text: feed._userFlagged ? 'Un-flag' : 'Flag', handler: () => { this.flagFeed(feed) } });
    if (feed.createdBy._id == this.userInfo['_id']) {
      if (!feed.isEvent) {
        options.push({ text: 'Edit', handler: () => { this.gotoEditFeed(feed); } });
      } else {
        options.push({ text: 'Edit', handler: () => { this.gotoEditEvent(event) } });
      }
      options.push({ text: 'Delete', handler: () => { this.confirmPostDeletion(feed) } });
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: options
    });
    actionSheet.present();
  }

  confirmPostDeletion(feed) {
    let alert = this.actionSheetCtrl.create({
      // title: 'Confirm deletion',
      // message: 'Do you want to delete this ' + (feed.isEvent ? 'event?' : 'post?'),
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this.feedProvider.deletePost(feed['_id']).subscribe((res: any) => {
              this.feed = {};
              this.goBack();
            }, error => {
              console.info('deletePost error', error);
            })
          }
        }, {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  flagFeed(feed) {
    if (feed['_userFlagged']) {
      let flagObj = feed['flagged'].filter(flag => {
        return (flag.actedBy._id == this.userInfo['_id']) || (flag.actedBy === this.userInfo['_id']);
      })[0];
      this.feedProvider.deleteFlagPost(feed['_id'], flagObj._id)
        .subscribe((res: any) => {
          // console.info('deleteFlagPost res', res);
          this.feed = this.feedProvider.processFeed(res);
        }, error => {
          console.info('deleteFlagPost error', error);
        })
    } else {
      this.feedProvider.flagPost(feed['_id'], { actedBy: this.userInfo['_id'], actionType: 'flag' })
        .subscribe((res: any) => {
          // console.info('flagPost res', res);
          this.feed = this.feedProvider.processFeed(res);
        }, error => {
          console.info('flagPost error', error);
        })
    }
  }

  joinEvent(event) {
    this.feedProvider.joinEvent(event['_id'], { actedBy: this.userInfo['_id'], actionType: 'going' })
      .subscribe((res: any) => {
        console.info('joinEvent res', res);
        this.feed = this.feedProvider.processFeed(res);
      }, error => {
        console.info('joinEvent error', error);
      });
  }

  confirmEventLeaveAction(event) {
    let options = [];
    options.push({ text: 'Leave', handler: () => { this.leaveEvent(event); } });
    options.push({ text: 'No', handler: () => { } });
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Leaving Event?',
      buttons: options
    });
    actionSheet.present();
  }

  leaveEvent(event) {
    let goingObj = event['going'].filter(go => {
      return (go.actedBy._id == this.userInfo['_id']) || (go.actedBy === this.userInfo['_id']);
    })[0];
    this.feedProvider.leaveEvent(event['_id'], goingObj['_id'])
      .subscribe((res: any) => {
        console.info('joinEvent res', res);
        this.feed = this.feedProvider.processFeed(res);
      }, error => {
        console.info('joinEvent error', error);
      });
  }

  showGiphyGif() {
    let gifModal = this.modalCtrl.create('GiphyModel');
    gifModal.onDidDismiss(gif => {
      if (gif) {
        // this.feedProvider.cloudinaryProvider.imageLocalPath = gif.images.fixed_height_downsampled.url;
        this.feedProvider.cloudinaryProvider.gif['id'] = gif.id;
        this.feedProvider.cloudinaryProvider.gif['still'] = gif.images.fixed_height_still;
        this.feedProvider.cloudinaryProvider.gif['gif'] = gif.images.fixed_height_downsampled;
      }
    });
    gifModal.present();
  }

  openLikeModel(likes, comments) {
    let modal = this.modalCtrl.create('LikeListPage', { likes: likes, comments: comments, userAvatar: this.userAvatar });
    modal.onDidDismiss(data => {
      console.info('data', data);
    });
    modal.present();
  }
}
