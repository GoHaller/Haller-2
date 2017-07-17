import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from "@ionic-native/push";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  local: Storage;

  @ViewChild(Nav) nav: Nav;

  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menu: MenuController
    , public push: Push) {
    this.local = new Storage('localstorage');

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.local.get('userInfo').then((val) => {
        if (val) {
          this.rootPage = 'Tabs';
        } else {
          this.rootPage = 'Login';
        }
      });
      statusBar.styleDefault();
      splashScreen.hide();
      console.info('splash', 'off');
      this.initPushNotification();
    });
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: "203386924222"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.info("registration data ", data);
      console.log("device token -> " + data.registrationId);
      this.local.set('userInfo', JSON.stringify(data)).then(() => {
      });
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.info('notification data', data);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        console.info("Push notification recieved");
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        console.info("Push notification clicked");
      }
    });
  }
}