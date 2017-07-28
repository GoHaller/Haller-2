import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Peers, PeerFilterPipe } from './peers';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    Peers, PeerFilterPipe
  ],
  imports: [
    IonicPageModule.forChild(Peers),
  ],
  exports: [
    Peers
  ],
  providers: [ProfileProvider, HttpClient]
})
export class PeersModule { }
