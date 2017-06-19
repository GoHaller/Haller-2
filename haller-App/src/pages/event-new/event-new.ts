import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FeedProvider } from '../feed/feed.provoder'


@IonicPage()
@Component({
  selector: 'page-event-new',
  templateUrl: 'event-new.html',
})
export class EventNew {

  private local: Storage;
  public userInfo: Object = {};
  private saveButtonText = 'Post';
  private headerText = 'Create New Event';
  public event: Object = {
    title: '',
    date: '',
    time: '',
    details: '',
    location: '',
    residentsFeed: true,
    discoveryFeed: false,
    updatedAt: new Date(),
    createdBy: '',
    authorResidence: '',
    isEvent: true,
  };
  myDate = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventProvider: FeedProvider,
    public loadingCtrl: LoadingController) {
    this.event = this.navParams.get('event') || this.event;
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.eventProvider.userId = this.userInfo['_id'];
      if (!this.event['_id']) {
        this.event['createdBy'] = this.userInfo['_id'];
        this.event['authorResidence'] = this.userInfo['residence'];
        this.event['discoveryFeed'] = this.navParams.get('whichfeed') == 'discovery';
        this.event['residentsFeed'] = this.navParams.get('whichfeed') == 'residents';
        this.event['date'] = new Date().toJSON();
        this.headerText = 'Create New Event';
      } else {
        this.saveButtonText = 'Done';
        // this.event['title'] = 'Haller';
        this.headerText = 'Edit Event';
      }
      // console.info('this.event', this.event);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventNew');
  }


  goBack() {
    this.navParams.get('resolve')(this.event['_id'] ? this.event : null);
    this.navCtrl.pop();
  }

  addEditEvent() {
    // this.feed['cover'] = this.feedProvider.cloudinaryProvider.imageLocalPath ? [this.feedProvider.cloudinaryProvider.imageLocalPath] : [];
    this.event['createdAt'] = new Date();
    if (this.event['title'] && this.event['date'] && this.event['location'] && this.event['details']) {
      this.event['time'] = this.event['date'];
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      loader.present();
      if (this.event['_id']) {
        let body = {
          title: this.event['title'],
          date: this.event['date'],
          time: this.event['time'],
          details: this.event['details'],
          location: this.event['location'],
          residentsFeed: this.event['residents'],
          discoveryFeed: this.event['discovery'],
          updatedAt: new Date(),
          createdBy: this.userInfo['_id'],
          authorResidence: this.userInfo['residence'],
          isEvent: true,
        };
        this.eventProvider.updateEvent(this.event['_id'], body).subscribe((observer: any) => {
          observer.subscribe((res: any) => {
            this.event = this.eventProvider.processFeed(res);
            loader.dismiss();
            this.goBack();
          }, error => {
            console.info('error', error);
            loader.dismiss();
          })
        }, error => {
          console.info('error', error);
          loader.dismiss();
        })
      } else {
        this.eventProvider.createEvent(this.event).subscribe((observer: any) => {
          observer.subscribe((res: any) => {
            this.event = this.eventProvider.processFeed(res);
            loader.dismiss();
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
    }
  }

  removeImage() {
    this.eventProvider.cloudinaryProvider.imageLocalPath = null;
  }

  takePictureFromPhotoLibrary() {
    this.eventProvider.cloudinaryProvider.pictureFromPhotoLibrary();
  }
  takePictureFromCamera() {
    this.eventProvider.cloudinaryProvider.pictureFromCamera();
  }

}
