import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { ProfileSettings } from './profile-settings';
import { AuthProvider } from '../../shared/providers/auth.provider';
import { HttpClient } from '../../shared/providers/http-client';
import { ProfileProvider } from "../../shared/providers/profile.provider";

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
    AuthProvider, HttpClient, ProfileProvider, Facebook
  ]
})
export class ProfileSettingsModule {}
