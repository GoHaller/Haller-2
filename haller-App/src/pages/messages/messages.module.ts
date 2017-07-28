import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Messages, ConvoFilterPipe } from './messages';
import { ConvoProvider } from "../../shared/providers/convo.provider";
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
  providers: [ConvoProvider, HttpClient]
})
export class MessagesModule { }
