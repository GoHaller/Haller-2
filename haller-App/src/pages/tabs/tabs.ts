import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Tabs, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { HttpClient } from '../../shared/providers/http-client';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  @ViewChild('mainTabs') tabRef: Tabs;

  local: Storage;
  tab1Root: any = 'Feed';
  tab2Root: any = "EventPage";
  tab3Root: any = "Messages";
  tab4Root: any = 'Notifications';
  tab5Root: any = 'Peers';
  mySelectedIndex: number = 0;
  firstNotification: any;
  private msgCount: String = '';
  private notiCount: String = '';
  public userInfo: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private statusBar: StatusBar,
    private splashScreen: SplashScreen, private httpClient: HttpClient, private event: Events, public alertCtrl: AlertController) {
    this.local = new Storage('localstorage');

    event.subscribe('notification:allrecieve', (data) => {
      let hashes = window.location.hash.split('/');
      let hash = hashes[hashes.length - 1];
      if (data.convo && hash == 'message') {
        if (typeof data.convo == 'string') data.convo = JSON.parse(data.convo);
        event.publish('notification:messagerecieve', data.convo._id);
      }
    });

    event.subscribe('notification:allclick', (data) => {
      let hashes = window.location.hash.split('/');
      let hash = hashes[hashes.length - 1];
      if (data.post) {
        if (typeof data.post == 'string') data.post = JSON.parse(data.post);
        if (hash != 'feed-detail')
          this.navCtrl.push('FeedDetail', { feedId: data.post._id, notificationId: data._id }, { animate: true, direction: 'forward' });
        else {
          this.event.publish('notification:feeddetail', data.post._id, data._id);
        }
      } else if (data.convo) {
        if (typeof data.convo == 'string') data.convo = JSON.parse(data.convo);
        if (hash != 'message')
          this.navCtrl.push('Message', { conversationId: data.convo._id }, { animate: true, direction: 'forward' });
        else {
          this.event.publish('notification:message', data.convo._id);
        }
      } else if (data.uni_msg) {
        this.local.set('university-notification', JSON.stringify(data)).then(() => { });
        this.tabRef.select(3);
        this.event.publish('notification:university');
      }
      this.getNotificationCount();
    })

    event.subscribe('notification:count', () => {
      this.local.get('last-notification-showed').then((notificationVal) => {
        if (notificationVal) {
          this.firstNotification = JSON.parse(notificationVal);
          this.getNotificationCount();
        }
      });
    });
  }

  ionViewDidLoad() {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.local.get('last-notification-showed').then((notificationVal) => {
        if (notificationVal) {
          this.firstNotification = JSON.parse(notificationVal);
        }
        this.getNotificationCount();
        this.updateUserData();
      });
      this.local.get('university-notification').then((data) => {
        if (data && this.tabRef)
          this.tabRef.select(3);
      });
    });
  }

  getNotificationCount() {
    let id = this.firstNotification ? this.firstNotification['_id'] : '';
    this.httpClient.post('/notifications/users/' + this.userInfo['_id'] + '/unread', { 'notificationId': id }).map(this.httpClient.extractData)
      .subscribe((res: any) => {
        // console.info('notifications res', res);
        this.msgCount = res.convo && res.convo > 0 ? res.convo : '';
        this.notiCount = res.notiCount && res.notiCount > 0 ? res.notiCount : '';
      }, error => {
        console.info('notifications error', error);
      });
  }

  updateUserData() {
    this.httpClient.get('/users/' + this.userInfo['_id']).map(this.httpClient.extractData)
      .subscribe((res: any) => {
        this.checkIfUserIsBlockedByAdmin(res);
      }, error => {
        console.info('userInfo error', error);
        // if (error._body.indexOf('No such user exists') > -1 || error._body.indexOf("Facebook account is already in use.") > -1) {
        if (error._body.indexOf('No such user exists') > -1) {
          this.checkIfUserIsBlockedByAdmin(null);
        }
      })
  }

  checkIfUserIsBlockedByAdmin(user) {
    if (user == null || user.isBlocked) {
      let prompt = this.alertCtrl.create({
        title: 'Blocked',
        subTitle: "Admin has blocked you from using this app, please visit the administrator.",
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.local.remove('auth');
              this.local.remove('uid');
              this.local.remove('userInfo');
              this.navCtrl.setRoot('Registration', {}, { animate: true, direction: 'back' })
            }
          }
        ]
      });
      prompt.present();
    }

  }

}
