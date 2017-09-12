import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Notifications } from './notifications';
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    Notifications,
  ],
  imports: [
    IonicPageModule.forChild(Notifications),
  ],
  exports: [
    Notifications
  ],
  providers: [HttpClient, InAppBrowser]
})
export class NotificationsModule { }
