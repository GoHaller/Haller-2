import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatBot } from './chat-bot';
import { HttpClient } from '../../shared/providers/http-client';
import { ConvoProvider } from "../../shared/providers/convo.provider";

@NgModule({
  declarations: [
    ChatBot,
  ],
  imports: [
    IonicPageModule.forChild(ChatBot),
  ],
  exports: [
    ChatBot
  ],
  providers: [ConvoProvider, HttpClient]
})
export class ChatBotModule { }
