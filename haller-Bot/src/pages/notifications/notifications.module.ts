import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Notifications } from './notifications';

@NgModule({
  declarations: [
    Notifications,
  ],
  imports: [
    IonicPageModule.forChild(Notifications),
  ],
})
export class NotificationsModule {}
