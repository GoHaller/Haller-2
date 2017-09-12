import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FeedProvider } from '../../shared/providers/feed.provider';

/**
 * Generated class for the Saved page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-saved',
  templateUrl: 'saved.html',
})
export class Saved {

  private local: Storage;
  private uid: String = '';
  private savedList = [];
  private refresher = null;
  private userAvatar = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public feedProvider: FeedProvider, storage: Storage) {
    this.local = storage;
    this.userAvatar = feedProvider.httpClient.userAvatar;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Saved');
    this.local.get('uid').then((val) => {
      this.uid = val;
      this.feedProvider.userId = val;
      this.getList();
    });
  }

  getList() {
    this.feedProvider.listSaved(this.uid)
      .subscribe((res: any) => {
        res.forEach(feed => {
          feed = this.feedProvider.processFeed(feed);
        });
        this.savedList = res;
        if (this.refresher) this.refresher.complete();
      }, error => {
        console.info('savedProvider.list error', error);
      })
  }

  getDateFormate(date) {
    return this.feedProvider.httpClient.getDateFormate(date);
  }

  gototFeedDetail(feed) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('FeedDetail', { feed: feed, resolve: resolve }, { animate: true, direction: 'forward' })
    }).then(data => {
      if (data['_id'] == feed['_id'])
        this.updateFeed(feed, data);
    });
  }

  updateFeed(oldFeed, newFeed) {
    let index = this.savedList.indexOf(oldFeed);
    newFeed = this.feedProvider.processFeed(newFeed);
    if (newFeed._userStarred)
      this.savedList[index] = newFeed;
    else
      this.savedList.splice(index, 1);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getList();
  }

}
