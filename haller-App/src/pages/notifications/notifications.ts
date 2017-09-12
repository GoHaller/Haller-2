import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { HttpClient } from '../../shared/providers/http-client';
import { ImageFullComponent } from '../../shared/pages/image.full'
import { Storage } from '@ionic/storage';
import { InAppBrowser } from "@ionic-native/in-app-browser";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class Notifications {

  private local: Storage;
  public userInfo: Object = {};
  private userMessage: string = '';
  private notifications = [];
  private whichnotification: String = 'university';
  private userAvatar = '';
  refresher: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private event: Events, storage: Storage,
    private iab: InAppBrowser, public modalCtrl: ModalController) {
    this.local = storage;
    this.userAvatar = httpClient.userAvatar;
    event.subscribe('notification:university', () => {
      this.whichnotification = 'university';
      this.getNotification();
    })
  }

  ionViewDidLoad() {
    this.local.get('university-notification').then((data) => {
      if (data) {
        this.whichnotification = 'university';
        this.local.set('university-notification', '').then(() => { });
        this.ionViewWillEnter();
      }
    });
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.getNotification();
    });
  }
  ionViewWillEnter() {
    if (this.userInfo['_id']) {
      this.getNotification();
    }
  }


  //http://localhost:4040/api/users/58c96fcf8b3c3400044cd3c0/notifications
  getNotification() {
    this.httpClient.get('/notifications/users/' + this.userInfo['_id'] + '?university=' + (this.whichnotification == 'university')).map(this.httpClient.extractData)
      .subscribe((res: any) => {
        this.userMessage = res.length > 0 ? '' : 'Nothing here yet.';
        this.notifications = res;
        if (this.refresher) {
          this.refresher.complete();
          this.refresher = null;
        }
        if (res.length > 0) {
          if (this.whichnotification == 'personal') {
            this.local.set('last-notification-showed', JSON.stringify(res[0])).then(() => {
              this.event.publish('notification:count');
            });
          }
        }
      }, error => {
        console.info('error', error);
      })
  }

  changeSegment(segment) {
    // this.skip = 0;
    this.whichnotification = segment;
    this.getNotification();
  }

  gototFeedDetail(noti) {
    if (!noti.university)
      this.navCtrl.push('FeedDetail', { feedId: noti.post._id, notificationId: noti._id }, { animate: true, direction: 'forward' });
  }

  getDateFormate(date) {
    return this.httpClient.getDateFormate(date);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getNotification();
  }

  checkIfPdf(url) {
    return url.endsWith('.pdf');
  }

  openUrl(url) {
    if (this.checkIfPdf(url))
      this.iab.create(url, '_system');
    else
      this.viewFullImage(url);
  }

  viewFullImage(image) {
    if (image) {
      let modal = this.modalCtrl.create(ImageFullComponent, { imgeSrc: image });
      modal.present();
    }
  }

}
