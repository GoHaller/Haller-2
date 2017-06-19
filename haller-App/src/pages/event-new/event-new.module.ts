import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';

import { EventNew } from './event-new';
import { CloudinaryProvider } from '../../shared/providers/cloudinary-provider';
import { FeedProvider } from '../feed/feed.provoder';
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    EventNew,
  ],
  imports: [
    IonicPageModule.forChild(EventNew),
  ],
  exports: [
    EventNew
  ],
  providers: [HttpClient, CloudinaryProvider, FeedProvider, Camera, Transfer]
})
export class EventNewModule {}
