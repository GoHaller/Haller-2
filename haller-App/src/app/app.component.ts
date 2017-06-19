import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  local: Storage;

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menu: MenuController, ) {
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
    });
  }
}

