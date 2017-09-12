import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ActionSheetController, Events, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { InAppBrowser } from "@ionic-native/in-app-browser";

/**
 * Generated class for the Event page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  local: Storage;
  public userInfo: Object = {};
  private whichfeed: String = 'residents';
  private eventList = [];
  private refresher = null;
  private infiniteScroll = null;
  private startskip = 0;
  private skip: number = 0;
  private limit: number = 10;
  private cleanList: Boolean = false;
  private userAvatar = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public feedProvider: FeedProvider, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController,
    private event: Events, private modalCtrl: ModalController, private iab: InAppBrowser, storage: Storage) {
    this.local = storage;
    this.userAvatar = feedProvider.httpClient.userAvatar;
  }

  ionViewDidLoad() {
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.feedProvider.userId = this.userInfo['_id'];
      this.getEvents();
    });
    this.event.subscribe('user-updated', () => {
      this.local.get('userInfo').then((val) => {
        this.userInfo = JSON.parse(val);
        this.getEvents();
      });
    });
  }

  viewFullImage(image) {
    this.feedProvider.viewFullImage(image);
  }

  getEvents() {
    this.feedProvider.listByFeed(this.userInfo['_id'], this.whichfeed, this.skip, this.limit, true)
      .subscribe((res: any) => {
        res.forEach(feed => {
          feed = this.feedProvider.processFeed(feed);
        });
        if (this.cleanList) { this.eventList = res; this.cleanList = false; }
        else { this.eventList = this.eventList.concat(res); }
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
        // console.info('this.eventList res', this.eventList);
      }, error => {
        console.info('listByFeed error', error);
      })
  }

  gotoEventNew() {
    if (this.allowUserToPost()) {
      new Promise((resolve, reject) => {
        this.navCtrl.push('EventNew', { resolve: resolve, whichfeed: this.whichfeed }, { animate: true, direction: 'forward' })
      }).then(data => {
        if (data !== null) {
          this.eventList.unshift(data);
        }
      });
    }
  }

  gototEventDetail(event) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('FeedDetail', { feed: event, resolve: resolve }, { animate: true, direction: 'forward' })
    }).then(data => {
      if (data['_id'] == event['_id'])
        this.updateFeed(event, data);
    });
  }

  gotoEditFeed(event) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('EventNew', { event: event, resolve: resolve }, { animate: true, direction: 'forward' })
    }).then(data => {
      if (data['_id'] == event['_id'])
        this.updateFeed(event, data);
    });
  }

  viewProfile(user) {
    this.navCtrl.push('Profile', { userData: user }, { animate: true, direction: 'forward' });
  }
  getlocalTime(date) {
    let d = new Date(date);
    let timeOffset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() + timeOffset);
    return d;
  }
  gotoProfileSetting() {
    this.navCtrl.push('ProfileSettings', {}, { animate: true, direction: 'back' });
  }

  allowUserToPost() {
    return (this.whichfeed == 'discovery' && this.feedProvider.isAdmin(this.userInfo['email'])) || this.whichfeed != 'discovery'
  }

  updateFeed(oldEvent, newEvent) {
    let index = this.eventList.indexOf(oldEvent);
    this.eventList[index] = this.feedProvider.processFeed(newEvent);
  }

  starEvent(event) {
    this.feedProvider.starFeed(event)
      .subscribe((res: any) => {
        this.updateFeed(event, res);
      }, error => {
        console.info('starPost error', error);
      })
  }

  likeEvent(event) {
    this.feedProvider.likeFeed(event)
      .subscribe((res: any) => {
        this.updateFeed(event, res);
        // console.info('likeFeed res', res);
      }, error => {
        console.info('likeFeed error', error);
      })
  }

  joinEvent(event) {
    this.feedProvider.joinEvent(event['_id'], { actedBy: this.userInfo['_id'], actionType: 'going' })
      .subscribe((res: any) => {
        // console.info('joinEvent res', res);
        this.updateFeed(event, res);
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
        this.updateFeed(event, res);
      }, error => {
        console.info('joinEvent error', error);
      });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Toast displayed successfully',
      duration: 3000,
      position: 'middle'//'top'//'bottom'
    });
    toast.present();
  }


  presentEventActionSheet(event) {
    let options = [];
    options.push({ text: event._userFlagged ? 'Unflag' : 'Flag', handler: () => { this.flagFeed(event) } });
    if (event.createdBy._id == this.userInfo['_id']) {
      options.push({ text: 'Edit', handler: () => { this.gotoEditFeed(event); } });
      options.push({ text: 'Delete', handler: () => { this.confirmEventDeletion(event) } });
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: options
    });
    actionSheet.present();
  }

  flagFeed(event) {
    if (event['_userFlagged']) {
      let flagObj = event['flagged'].filter(flag => {
        return (flag.actedBy._id == this.userInfo['_id']) || (flag.actedBy === this.userInfo['_id']);
      })[0];
      this.feedProvider.deleteFlagPost(event['_id'], flagObj._id)
        .subscribe((res: any) => {
          // console.info('deleteFlagPost res', res);
          this.updateFeed(event, this.feedProvider.processFeed(res));
        }, error => {
          console.info('deleteFlagPost error', error);
        })
    } else {
      this.feedProvider.flagPost(event['_id'], { actedBy: this.userInfo['_id'], actionType: 'flag' })
        .subscribe((res: any) => {
          // console.info('flagPost res', res);
          this.updateFeed(event, this.feedProvider.processFeed(res));
        }, error => {
          console.info('flagPost error', error);
        })
    }
  }

  confirmEventDeletion(event) {
    let alert = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.feedProvider.deletePost(event['_id']).subscribe((res: any) => {
              this.cleanList = true;
              this.getEvents();
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

  getDateFormatr(date) {
    return this.feedProvider.httpClient.getDateFormate(date);
  }

  changeSegment(segmentName) {
    this.skip = 0;
    this.whichfeed = segmentName;
    this.cleanList = true;
    this.getEvents();
  }

  doRefresh(refresher) {
    this.skip = this.startskip;
    this.cleanList = true;
    this.refresher = refresher;
    this.getEvents();
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.skip += this.limit;
    this.getEvents();
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
