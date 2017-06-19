import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Peers, PeerFilterPipe } from './peers';
import { PeersProvider } from './peers.provider';
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
  providers: [PeersProvider, HttpClient]
})
export class PeersModule { }
