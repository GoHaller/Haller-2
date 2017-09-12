import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '../../shared/providers/http-client';
import 'rxjs/add/operator/catch';

/**
 * Generated class for the ActivityLog page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-activity-log',
  templateUrl: 'activity-log.html',
})
export class ActivityLog {

  private local: Storage;
  private uid: String = '';
  private activityList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpClient: HttpClient, storage: Storage) {
    this.local = storage;
  }

  ionViewDidLoad() {
    this.local.get('uid').then(val => {
      this.uid = val;
      this.getActivities();
    });
  }

  getActivities() {
    this.fetchActivities()
      .subscribe((res: any) => {
        this.activityList = res;
      }, err => {
        console.info('error', err);
      })
  }

  fetchActivities() {
    return this.httpClient.get('/users/' + this.uid + '/activity').map(this.httpClient.extractData);
  }

  getDateFormatr(date) {
    return this.httpClient.getDateFormate(date);
  }

  gototFeedDetail(post) {
    this.navCtrl.push('FeedDetail', { feedId: post._id }, { animate: true, direction: 'forward' })
  }

  getActivityIcon(act) {
    var icon = 'ios-thumbs-up-outline';
    switch (act.activityType) {
      case 1: icon = 'list-box-outline'; break;
      case 2: icon = 'list-box-outline'; break;
      case 3: icon = 'list-box-outline'; break;
      case 4: icon = 'ios-thumbs-up-outline'; break;
      case 5: icon = 'ios-thumbs-down-outline'; break;
      case 6: icon = 'flag'; break;
      case 7: icon = 'flag'; break;
      case 8: icon = 'list-box-outline'; break;
      case 9: icon = 'list-box-outline'; break;
      case 10: icon = 'ios-text-outline'; break;
      case 11: icon = 'ios-text-outline'; break;
      case 12: icon = 'ios-text-outline'; break;
      case 13: icon = 'ios-thumbs-up-outline'; break;
      case 14: icon = 'ios-thumbs-down-outline'; break;
      case 15: icon = 'flag'; break;
      case 16: icon = 'flag'; break;
      case 17: icon = 'calendar-outline'; break;
      case 18: icon = 'calendar-outline'; break;
    }
    return icon;
  }

}
