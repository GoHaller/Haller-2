import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventPage } from './event';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { HttpClient } from '../../shared/providers/http-client';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';

@NgModule({
  declarations: [
    EventPage,
  ],
  imports: [
    IonicPageModule.forChild(EventPage),
  ],
  exports: [
    EventPage
  ],
  providers: [HttpClient, FeedProvider, CloudinaryProvider, Camera, Transfer]
})
export class EventPageModule {}
