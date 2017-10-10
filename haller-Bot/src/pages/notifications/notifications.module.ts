import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Notifications } from './notifications';
import { BotconvoProvider } from "../../providers/botconvo-provider";

@NgModule({
  declarations: [
    Notifications
  ],
  imports: [
    IonicPageModule.forChild(Notifications),
  ],
  providers: [BotconvoProvider]
})
export class NotificationsModule { }
