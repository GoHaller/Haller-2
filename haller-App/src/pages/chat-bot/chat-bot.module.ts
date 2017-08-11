import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatBot } from './chat-bot';
import { HttpClient } from '../../shared/providers/http-client';
import { ConvoProvider } from "../../shared/providers/convo.provider";
import { GoogleMaps } from '@ionic-native/google-maps';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    ChatBot
  ],
  imports: [
    IonicPageModule.forChild(ChatBot)
  ],
  exports: [
    ChatBot
  ],
  providers: [ConvoProvider, HttpClient, GoogleMaps, InAppBrowser]
})
export class ChatBotModule { }
