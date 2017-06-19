import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
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
  providers: [HttpClient]
})
export class NotificationsModule { }
