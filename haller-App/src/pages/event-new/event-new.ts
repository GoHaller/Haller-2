import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder } from '@angular/forms';
import { FeedProvider } from '../../shared/providers/feed.provider';


@IonicPage()
@Component({
  selector: 'page-event-new',
  templateUrl: 'event-new.html',
})
export class EventNew {

  private local: Storage;
  public userInfo: Object = {};
  private eventForm: any;
  private saveButtonText = 'Post';
  private headerText = 'Create New Event';
  public event: Object = {
    title: '',
    date: '',
    time: '',
    location: '',
    residentsFeed: true,
    discoveryFeed: false,
    updatedAt: new Date(),
    createdBy: '',
    authorResidence: '',
    isEvent: true,
  };
  public minDate: any;
  public maxDate: any;
  myDate = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams, private feedProvider: FeedProvider,
    public loadingCtrl: LoadingController, private formBuilder: FormBuilder, storage: Storage) {
    this.event = this.navParams.get('event') || this.event;
    this.local = storage;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);

    this.eventForm = this.formBuilder.group({
      title: [this.event['title'] || '', Validators.compose([Validators.maxLength(30), Validators.required])],
      date: [this.event['date'] || localISOTime, Validators.compose([Validators.required])],
      location: [this.event['location'] || '', Validators.compose([Validators.maxLength(30), Validators.required])],
      details: [this.event['details'] || '', Validators.compose([Validators.required])]
    });

    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.feedProvider.userId = this.userInfo['_id'];
      this.event['discoveryFeed'] = this.navParams.get('whichfeed') == 'discovery';
      this.event['residentsFeed'] = this.navParams.get('whichfeed') == 'residents';
      if (!this.event['_id']) {
        this.event['createdBy'] = this.userInfo['_id'];
        this.event['authorResidence'] = this.userInfo['residence'];
        this.event['date'] = new Date().toISOString();
        this.headerText = 'Create New Event';
      } else {
        this.saveButtonText = 'Done';
        // this.event['title'] = 'Haller';
        this.headerText = 'Edit Event';
      }
    });
    this.minDate = this.myDate.getFullYear();
    this.maxDate = (this.myDate.getFullYear() + 5);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventNew');
  }


  goBack() {
    let resolve = this.navParams.get('resolve');
    if (resolve) resolve(this.event['_id'] ? this.event : null);
    this.navCtrl.pop();
  }

  addEditEvent(data) {
    // this.feed['cover'] = this.feedProvider.cloudinaryProvider.imageLocalPath ? [this.feedProvider.cloudinaryProvider.imageLocalPath] : [];
    this.event['createdAt'] = new Date();
    let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    loader.present();
    let body = {
      title: data.title,
      date: data.date,
      time: data.date,
      details: data.details,
      location: data.location,
      residentsFeed: this.event['residentsFeed'].toString(),
      discoveryFeed: this.event['discoveryFeed'].toString(),
      updatedAt: new Date(),
      createdBy: this.userInfo['_id'],
      authorResidence: this.userInfo['residence'],
      isEvent: true,
    };
    if (this.event['_id']) {
      this.feedProvider.updateEvent(this.event['_id'], body).subscribe((observer: any) => {
        observer.subscribe((res: any) => {
          this.event = this.feedProvider.processFeed(res);
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
      this.feedProvider.createEvent(body).subscribe((observer: any) => {
        observer.subscribe((res: any) => {
          this.event = this.feedProvider.processFeed(res);
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

  removeImage() {
    this.feedProvider.cloudinaryProvider.imageLocalPath = null;
  }

  takePictureFromPhotoLibrary() {
    this.feedProvider.cloudinaryProvider.pictureFromPhotoLibrary();
  }
  takePictureFromCamera() {
    this.feedProvider.cloudinaryProvider.pictureFromCamera();
  }

  onPageWillLeave() {
    this.removeImage();
  }

}
