import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { ProfileEdit } from './profile-edit';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { HttpClient } from '../../shared/providers/http-client';

import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';
import { AuthProvider } from "../../shared/providers/auth.provider";

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
  providers: [ProfileProvider, HttpClient, CloudinaryProvider, Facebook, Camera, Transfer, AuthProvider]
})
export class ProfileEditModule { }
