import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '../../shared/providers/http-client';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the Notifications page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpClient: HttpClient) {
    this.local = new Storage('localstorage');
  }

  ionViewDidLoad() {
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
    this.httpClient.get('/users/' + this.userInfo['_id'] + '/notifications').map(this.httpClient.extractData)
      .subscribe((res: any) => {
        this.userMessage = res.length > 0 ? '' : 'It seems you haven\'t share/post anything yet.';
        this.notifications = res;
      }, error => {
        console.info('error', error);
      })
  }

  gototFeedDetail(noti) {
    this.httpClient.get('/users/' + this.userInfo['_id'] + '/notification/' + noti._id + '/read').map(this.httpClient.extractData)
      .subscribe((res: any) => {
        let index = this.notifications.indexOf(noti);
        this.notifications[index] = res;
      }, error => {
        console.info('error', error);
      });
    this.navCtrl.push('FeedDetail', { feedId: noti.post._id }, { animate: true, direction: 'forward' });
  }





  getDateFormate(date) {
    return this.httpClient.getDateFormate(date);
  }

}
