import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileEdit } from './profile-edit';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { HttpClient } from '../../shared/providers/http-client';

import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';

@NgModule({
  declarations: [
    ProfileEdit
  ],
  imports: [
    IonicPageModule.forChild(ProfileEdit),
  ],
  exports: [
    ProfileEdit
  ],
  providers: [ProfileProvider, HttpClient, CloudinaryProvider, Camera, Transfer]
})
export class ProfileEditModule { }
