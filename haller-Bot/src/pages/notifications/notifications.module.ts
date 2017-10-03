import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Notifications } from './notifications';
import { BotconvoProvider } from "../../providers/botconvo-provider";
import { ImageFullComponent } from '../view-image/image.full';

@NgModule({
  declarations: [
    Notifications,ImageFullComponent
  ],
  imports: [
    IonicPageModule.forChild(Notifications),
  ],
  providers: [BotconvoProvider]
})
export class NotificationsModule { }
