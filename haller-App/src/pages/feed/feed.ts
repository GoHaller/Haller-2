import { Component } from '@angular/core';
import { PopoverController, IonicPage, NavController, NavParams, LoadingController, ActionSheetController, AlertController, Events, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class Feed {

  private local: Storage;
  public userInfo: Object = {};
  public whichfeed: String = 'residents';
  public feedList = [];
  public refresher = null;
  public infiniteScroll = null;
  public startskip = 0;
  public skip: number = 0;
  public limit: number = 10;
  public cleanList: Boolean = false;
  public userAvatar = '';
  public proceesingPost = 0;
  public proceesedPost = 0;

  // private loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public feedProvider: FeedProvider, private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController, private event: Events, private modalCtrl: ModalController,
    private iab: InAppBrowser, storage: Storage) {
    this.local = storage;
    this.userAvatar = feedProvider.httpClient.userAvatar;
  }

  ionViewDidLoad() {
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      // this.loader.present();
      this.feedProvider.userId = this.userInfo['_id'];
      this.getFeeds();
    });
    this.event.subscribe('user-updated', () => {
      this.local.get('userInfo').then((val) => {
        this.userInfo = JSON.parse(val);
        this.cleanList = true;
        this.getFeeds();
      });
    });
    this.local.get('intro').then((val) => {
      let intro = val ? JSON.parse(val) : null;
      if (!intro || intro.indexOf(1) == -1) {
        let modal = this.modalCtrl.create('Intro', { intro: 1 });
        modal.present();
        if (!intro) intro = [1];
        else intro.push(1);
        this.local.set('intro', JSON.stringify(intro));
      }
    });
    // this.navCtrl.push('Intro', { intro: 1 }, { animate: true, direction: 'up' })
  }

  allowUserToPost() {
    return (this.whichfeed == 'discovery' && this.feedProvider.isAdmin(this.userInfo['email'])) || this.whichfeed != 'discovery'
  }

  gotoFeedNew() {
    if (this.allowUserToPost()) {
      new Promise((resolve, reject) => {
        this.navCtrl.push('FeedNew', { resolve: resolve, whichfeed: this.whichfeed }, { animate: true, direction: 'forward' })
      }).then(data => {
        if (data !== null) {
          this.feedList.unshift(data);
        }
        // this.addEditFeed(null, data);
      });
    }
  }

  gototFeedDetail(feed) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('FeedDetail', { feed: feed, resolve: resolve }, { animate: true, direction: 'forward' })
    }).then(data => {
      if (data['_id'] == feed['_id'])
        this.updateFeed(feed, data);
    });
  }

  gotoEditFeed(feed) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('FeedNew', { feed: feed, resolve: resolve }, { animate: true, direction: 'forward' })
    }).then(data => {
      if (data['_id'] == feed['_id'])
        this.updateFeed(feed, data);
      // this.addEditFeed(feed, data);
    });
  }

  addEditFeed(oldfeed, feed) {
    if (this.proceesedPost == this.proceesingPost) {
      this.proceesedPost = 0;
      this.proceesingPost = 0;
    }
    this.proceesingPost += 1;
    this.feedProvider.addFeed(feed)
      .subscribe((observ: any) => {
        observ.subscribe((res: any) => {
          if (oldfeed && oldfeed['_id'] == res['_id'])
            this.updateFeed(oldfeed, res);
          else if (oldfeed == null) {
            this.feedList.unshift(res);
          }
          this.proceesedPost += 1;
        }, error => {
          console.info('error', error);
          this.proceesedPost += 1;
        })
      }, error => {
        console.info('error', error);
        this.proceesedPost += 1;
      })
  }

  viewProfile(user) {
    // console.info('peer', peer);
    this.navCtrl.push('Profile', { userData: user }, { animate: true, direction: 'forward' });
  }

  gotoProfileSetting() {
    this.navCtrl.push('ProfileSettings', {}, { animate: true, direction: 'back' });
  }

  updateFeed(oldFeed, newFeed) {
    let index = this.feedList.indexOf(oldFeed);
    this.feedList[index] = this.feedProvider.processFeed(newFeed);
  }

  getFeeds() {
    this.feedProvider.listByFeed(this.userInfo['_id'], this.whichfeed, this.skip, this.limit, false)
      .subscribe((res: any) => {
        res.forEach(feed => {
          feed = this.feedProvider.processFeed(feed);
        });
        if (this.cleanList) { this.feedList = res; this.cleanList = false; }
        else { this.feedList = this.feedList.concat(res); }
        if (this.refresher) {
          this.refresher.complete();
          this.refresher = null;
        }
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          if (res.length == 0)
            this.infiniteScroll.enable(false);
          this.infiniteScroll = null;
        }
      }, error => {
        console.info('listByFeed error', error);
        if (this.refresher) {
          this.refresher.complete();
          this.refresher = null;
        }
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          this.infiniteScroll.enable(false);
          this.infiniteScroll = null;
        }
      })
  }

  starFeed(feed) {
    this.feedProvider.starFeed(feed)
      .subscribe((res: any) => {
        this.updateFeed(feed, res);
        // console.info('starPost res', res);
      }, error => {
        console.info('starPost error', error);
      })
  }


  likeFeed(feed) {
    this.feedProvider.likeFeed(feed)
      .subscribe((res: any) => {
        this.updateFeed(feed, res);
        // console.info('likeFeed res', res);
      }, error => {
        console.info('likeFeed error', error);
      })
  }

  viewFullImage(image) {
    this.feedProvider.viewFullImage(image);
  }

  presentFeedActionSheet(feed) {
    let options = [];
    options.push({ text: feed._userFlagged ? 'Unflag' : 'Flag', handler: () => { this.flagFeed(feed) } });
    // options.push({ text: 'Share', handler: () => { this.shareFeed(feed) } });
    if (feed.createdBy._id == this.userInfo['_id']) {
      options.push({ text: 'Edit', handler: () => { this.gotoEditFeed(feed); } });
      options.push({ text: 'Delete', handler: () => { this.confirmPostDeletion(feed) } });
    }
    let actionSheet = this.actionSheetCtrl.create({ title: '', buttons: options });
    actionSheet.present();
  }

  confirmPostDeletion(feed) {
    let alert = this.actionSheetCtrl.create({
      // title: 'Confirm delete',
      // message: 'Do you want to delete this post?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this.feedProvider.deletePost(feed['_id']).subscribe((res: any) => {
              this.cleanList = true;
              this.getFeeds();
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
          this.updateFeed(feed, this.feedProvider.processFeed(res));
        }, error => {
          console.info('deleteFlagPost error', error);
        })
    } else {
      this.feedProvider.flagPost(feed['_id'], { actedBy: this.userInfo['_id'], actionType: 'flag' })
        .subscribe((res: any) => {
          // console.info('flagPost res', res);
          this.updateFeed(feed, this.feedProvider.processFeed(res));
        }, error => {
          console.info('flagPost error', error);
        })
    }
  }

  getDateFormatr(date) {
    return this.feedProvider.httpClient.getDateFormate(date);
  }

  changeSegment(segmentName) {
    this.skip = 0;
    this.whichfeed = segmentName;
    this.cleanList = true;
    this.getFeeds();
  }

  doRefresh(refresher) {
    this.skip = this.startskip;
    this.cleanList = true;
    this.refresher = refresher;
    this.getFeeds();
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.skip += this.limit;
    this.getFeeds();
  }

  openLikeModel(likes, comments) {
    let modal = this.modalCtrl.create('LikeListPage', { likes: likes, comments: comments, userAvatar: this.userAvatar });
    modal.onDidDismiss(data => {
      console.info('data', data);
    });
    modal.present();
  }

  openExternalLink(link) {
    if (this.checkLink(link)) {
      if (link.indexOf('http') > 5 || link.indexOf('http') == -1)
        link = 'http://' + link;
      this.iab.create(link, '_system');
    }
  }

  checkLink(detail) {
    // let exp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    let exp = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
    return exp.test(detail)
  }

}
