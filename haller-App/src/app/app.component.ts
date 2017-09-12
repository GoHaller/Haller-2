import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
// import { checkAvailability } from '@ionic-native/core';
// import { Push, PushToken } from '@ionic/cloud-angular';
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { LocalNotifications } from "@ionic-native/local-notifications";
// import { Landing } from "../pages/landing/landing";

declare var PushNotification;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  local: Storage;

  @ViewChild(Nav) nav: Nav;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
    public menu: MenuController, private push: Push, private localNotifications: LocalNotifications, private event: Events, storage: Storage) {
    this.local = storage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.initPushNotification();
      this.rootPage = 'Landing';
      // this.local.get('userInfo').then((val) => {
      //   if (val) {
      //     this.rootPage = Landing;
      //   } else {
      //     this.rootPage = 'Registration';
      //   }
      // });
      //Registration
      statusBar.styleDefault();
      splashScreen.hide();
      // console.log('connection', navigator.onLine);
    });

  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    const options: PushOptions = {
      android: { senderID: "228084760849", icon: 'icon', sound: true },
      ios: { senderID: "228084760849", alert: true, badge: false, sound: true },
      windows: {}
    };
    //categories: { 'view': { yes: { callback: 'this.iosNotificationClick', title: "View", foreground: true, destructive: false } } }
    // console.info("options data ", options);
    const pushObject: PushObject = this.push.init(options);
    // console.info('checkAvailability', checkAvailability('PushNotification', 'init', 'PushNotification'));
    pushObject.on('registration').subscribe((data: any) => {
      let device = { data: data, deviceData: { token: data.registrationId, os: (this.platform.is('ios') ? 'ios' : (this.platform.is('android') ? 'android' : 'windows')), createdAt: new Date() } };
      // console.info('device', device);
      this.local.set('fcm-data', JSON.stringify(device)).then(() => { });

      this.localNotifications.on('click', (data: any, state: any) => {
        // console.info('localNotifications click data', data)
        if (this.platform.is('ios')) {
          data.aps = null;
          this.gotoDetailPage(data, true);
        } else {
          this.gotoDetailPage(JSON.parse(data.data), true);
        }
      })
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      // console.info('notification data', data);
      if (data.additionalData.foreground) {
        // if application open, show popup
        this.shaoLocalNotification(data);
        this.event.publish('notification:allrecieve', data.additionalData);
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.gotoDetailPage(data.additionalData, false);
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
      if (this.platform.is('ios')) {
        pushObject.finish().then((fdata: any) => {
          // this.shaoLocalNotification(data);
        }, (edata: any) => {
          // console.info('finish edata', edata);
        })
      }
    });
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  shaoLocalNotification(data) {
    if (this.platform.is('android')) {
      this.localNotifications.schedule({
        id: data.additionalData.notId,
        title: data.title || 'Haller', text: data.message || data.additionalData.message,
        data: data.additionalData
      });
    }
  }

  iosNotificationClick(data) {
    this.gotoDetailPage(data, true);
  }

  gotoDetailPage(data, push) {
    this.event.publish('notification:allclick', data);
  }
}
