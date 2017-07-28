import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HttpClient } from '../../shared/providers/http-client';
import { Saved } from './saved';
import { FeedProvider } from '../../shared/providers/feed.provider';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';

@NgModule({
  declarations: [
    Saved,
  ],
  imports: [
    IonicPageModule.forChild(Saved),
  ],
  exports: [
    Saved
  ],
  providers: [
    FeedProvider, HttpClient, CloudinaryProvider, Camera, Transfer
  ]
})
export class SavedModule { }
