import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSettings } from './profile-settings';
import { LoginProvider } from '../login/login.provider'
import { HttpClient } from '../../shared/providers/http-client';
import { ProfileEditProvider } from "../profile-edit/profile-edit.provider";

@NgModule({
  declarations: [
    ProfileSettings,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSettings),
  ],
  exports: [
    ProfileSettings
  ],
  providers:[
    LoginProvider, HttpClient, ProfileEditProvider
  ]
})
export class ProfileSettingsModule {}
