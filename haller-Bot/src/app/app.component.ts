import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: NavController
  rootPage: any = '';
  local: Storage;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, storage: Storage,
    private push: Push, private localNotifications: LocalNotifications) {
    this.local = storage;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.local.get('userInfo').then((val) => {
        // console.log('val', val);
        if (val) {
          this.rootPage = 'Chatbot';
        } else {
          this.rootPage = 'Registration';
        }
        this.initPushNotification();
      })
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
        // if (this.platform.is('ios')) {
        //   data.aps = null;
        //   this.gotoDetailPage(data, true);
        // } else {
        //   this.gotoDetailPage(JSON.parse(data.data), true);
        // }
      })
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.info('notification data', data);
      if (data.additionalData.foreground) {
        // if application open, show popup
        this.shaoLocalNotification(data);
        // this.event.publish('notification:allrecieve', data.additionalData);
      } else {
        if (data.additionalData.type == 1) {
          this.nav.push('Notifications');
        }

        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        // this.gotoDetailPage(data.additionalData, false);
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
        title: data.title || 'HallerBot', text: data.message || data.additionalData.message,
        data: data.additionalData
      });
    }
  }
}

