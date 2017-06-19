import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageSetting } from './message-setting';
import { MessagesProvider } from "../messages/messages.provider";
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    MessageSetting,
  ],
  imports: [
    IonicPageModule.forChild(MessageSetting),
  ],
  exports: [
    MessageSetting
  ],
  providers: [MessagesProvider, HttpClient]
})
export class MessageSettingModule { }
