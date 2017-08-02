import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FeedProvider } from '../../shared/providers/feed.provider';

/**
 * Generated class for the FeedNew page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-feed-new',
  templateUrl: 'feed-new.html',
})
export class FeedNew {

  private local: Storage;
  public userInfo: Object = {};
  private saveButtonText = 'Post';
  private headerText = 'Create New Feed';
  public feed: Object = {
    residentsFeed: true,
    discoveryFeed: false,
    title: 'Haller',
    cover: [],
    createdBy: '',
    authorResidence: '',
    isEvent: false
  };
  private userAvatar = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public feedProvider: FeedProvider,
    public loadingCtrl: LoadingController) {
    this.feed = this.navParams.get('feed') || this.feed;
    this.local = new Storage('localstorage');
    this.userAvatar = feedProvider.httpClient.userAvatar;
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.feedProvider.userId = this.userInfo['_id'];
      // console.info('this.feed', this.feed);
      if (!this.feed['_id']) {
        this.feed['createdBy'] = this.userInfo['_id'];
        this.feed['authorResidence'] = this.userInfo['residence'];
        this.feed['discoveryFeed'] = this.navParams.get('whichfeed') == 'discovery';
        this.feed['residentsFeed'] = this.navParams.get('whichfeed') == 'residents';
        this.headerText = 'Create New Feed';
      } else {
        this.saveButtonText = 'Done';
        this.feed['title'] = 'Haller';
        this.headerText = 'Edit Feed';
      }
    });
  }

  goBack() {
    this.navParams.get('resolve')(this.feed['_id'] ? this.feed : null);
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedNew');
  }

  removeImage() {
    this.feedProvider.cloudinaryProvider.imageLocalPath = null;
  }

  takePictureFromPhotoLibrary() {
    this.feedProvider.cloudinaryProvider.pictureFromPhotoLibrary();
  }
  takePictureFromCamera() {
    this.feedProvider.cloudinaryProvider.pictureFromCamera()
  }

  addEditFeed() {
    // this.feed['cover'] = this.feedProvider.cloudinaryProvider.imageLocalPath ? [this.feedProvider.cloudinaryProvider.imageLocalPath] : [];
    this.feed['createdAt'] = new Date();
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loader.present();
    this.feedProvider.addFeed(this.feed)
      .subscribe((observ: any) => {
        observ.subscribe((res: any) => {
          loader.dismiss();
          this.feed = res;
          this.removeImage();
          this.goBack();
        }, error => {
          console.info('error', error);
          loader.dismiss();
        })
      }, error => {
        console.info('error', error);
        loader.dismiss();
      })
  }

  onPageWillLeave() {
    this.removeImage();
  }
}
