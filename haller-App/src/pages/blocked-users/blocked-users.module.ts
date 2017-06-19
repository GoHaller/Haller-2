import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockedUsers } from './blocked-users';
import { ProfileEditProvider } from "../profile-edit/profile-edit.provider";
import { HttpClient } from '../../shared/providers/http-client';
import { MessagesProvider } from "../messages/messages.provider";

@NgModule({
  declarations: [
    BlockedUsers,
  ],
  imports: [
    IonicPageModule.forChild(BlockedUsers),
  ],
  exports: [
    BlockedUsers
  ],
  providers: [ProfileEditProvider, HttpClient, MessagesProvider]
})
export class BlockedUsersModule { }
