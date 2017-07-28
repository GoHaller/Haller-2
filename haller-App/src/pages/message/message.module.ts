import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';

import { Message, PeerFilterPipe } from './message';
import { ConvoProvider } from "../../shared/providers/convo.provider";
import { HttpClient } from '../../shared/providers/http-client';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';

@NgModule({
  declarations: [
    Message, PeerFilterPipe
  ],
  imports: [
    IonicPageModule.forChild(Message),
  ],
  exports: [
    Message
  ],
  providers: [ConvoProvider, HttpClient, CloudinaryProvider, Camera,Transfer],
})
export class MessageModule {}
