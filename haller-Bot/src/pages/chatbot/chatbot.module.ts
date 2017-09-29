import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chatbot } from './chatbot';
import { BotconvoProvider } from "../../providers/botconvo-provider";

@NgModule({
  declarations: [
    Chatbot,
  ],
  imports: [
    IonicPageModule.forChild(Chatbot),
  ],
  providers: [BotconvoProvider]
})
export class ChatbotModule { }
