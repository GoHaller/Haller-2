import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageSetting } from './message-setting';
import { ConvoProvider } from "../../shared/providers/convo.provider";
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
  providers: [ConvoProvider, HttpClient]
})
export class MessageSettingModule { }
