import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';

import { FeedDetail } from './feed-detail';
import { HttpClient } from '../../shared/providers/http-client';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';

@NgModule({
  declarations: [
    FeedDetail,
  ],
  imports: [
    IonicPageModule.forChild(FeedDetail),
  ],
  exports: [
    FeedDetail
  ],
  providers: [HttpClient, FeedProvider, CloudinaryProvider, Camera, Transfer]
})
export class FeedDetailModule {}
