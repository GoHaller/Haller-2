import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockedUsers, BlockedFilterPipe } from './blocked-users';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { HttpClient } from '../../shared/providers/http-client';
import { ConvoProvider } from "../../shared/providers/convo.provider";

@NgModule({
  declarations: [
    BlockedUsers, BlockedFilterPipe
  ],
  imports: [
    IonicPageModule.forChild(BlockedUsers),
  ],
  exports: [
    BlockedUsers
  ],
  providers: [ProfileProvider, HttpClient, ConvoProvider]
})
export class BlockedUsersModule { }
