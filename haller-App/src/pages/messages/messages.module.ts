import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Messages, ConvoFilterPipe } from './messages';
import { MessagesProvider } from './messages.provider'
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    Messages, ConvoFilterPipe
  ],
  imports: [
    IonicPageModule.forChild(Messages),
  ],
  exports: [
    Messages
  ],
  providers: [MessagesProvider, HttpClient]
})
export class MessagesModule { }
