import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Feed } from './feed';
import { HttpClient } from '../../shared/providers/http-client';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';

@NgModule({
  declarations: [
    Feed, 
  ],
  imports: [
    IonicPageModule.forChild(Feed),
  ],
  exports: [
    Feed, 
  ],
  providers: [HttpClient, FeedProvider, CloudinaryProvider, Camera, Transfer]
})
export class FeedModule { }
