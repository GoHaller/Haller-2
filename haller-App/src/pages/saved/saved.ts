import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SavedProvider } from "./saved.provider";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private savedProvider: SavedProvider) {
    this.local = new Storage('localstorage');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Saved');
    this.local.get('uid').then((val) => {
      this.uid = val;
      this.getList();
    });
  }

  getList() {
    this.savedProvider.list(this.uid)
      .subscribe((res: any) => {
        res.forEach(feed => {
          feed = this.processFeed(feed);
        });
        this.savedList = res;
        if(this.refresher) this.refresher.complete();
        // console.info('savedProvider.list res', res);
      }, error => {
        console.info('savedProvider.list error', error);
      })
  }

  getDateFormate(date) {
    return this.savedProvider.httpClient.getDateFormate(date);
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
    newFeed = this.processFeed(newFeed);
    if (newFeed._userStarred)
      this.savedList[index] = newFeed;
    else
      this.savedList.splice(index, 1);
  }

  processFeed(post) {
    let _userLiked = post.liked.filter(l => {
      return l.actedBy._id == this.uid;
    })[0];
    post._userLiked = (_userLiked && _userLiked._id);

    let _userGoing = post.going.filter(g => {
      return g.actedBy._id == this.uid;
    })[0];
    post._userGoing = (_userGoing && _userGoing._id);

    let _userStarred = post.starred.filter(g => {
      return g.actedBy._id == this.uid;
    })[0];
    post._userStarred = (_userStarred && _userStarred._id);

    let _userFlagged = post.flagged.filter(g => {
      return g.actedBy._id == this.uid;
    })[0];
    post._userFlagged = (_userFlagged && _userFlagged._id);

    return post;
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getList();
  }

}
