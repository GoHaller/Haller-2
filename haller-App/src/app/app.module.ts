import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Push } from '@ionic-native/push';
import { LocalNotifications } from "@ionic-native/local-notifications";

import { MyApp } from './app.component';
import { TabsPage } from "../pages/tabs/tabs";
import { ImageFullComponent } from '../shared/pages/image.full';
import { HttpClient } from '../shared/providers/http-client';

@NgModule({
  declarations: [
    MyApp, TabsPage, ImageFullComponent
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Back',
      backButtonIcon: 'none',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, TabsPage, ImageFullComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Push, LocalNotifications, HttpClient
  ]
})
export class AppModule { }
