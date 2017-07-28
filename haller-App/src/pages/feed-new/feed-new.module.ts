import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { FeedNew } from './feed-new';

import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    FeedNew,
  ],
  imports: [
    IonicPageModule.forChild(FeedNew),
  ],
  exports: [
    FeedNew
  ],
  providers: [HttpClient, CloudinaryProvider, FeedProvider, Camera, Transfer]
})
export class FeedNewModule { }
