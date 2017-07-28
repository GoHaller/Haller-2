import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { Registration } from './registration';
import { AuthProvider } from '../../shared/providers/auth.provider';
import { HttpClient } from '../../shared/providers/http-client';
import { ProfileProvider } from "../../shared/providers/profile.provider";

import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';

@NgModule({
  declarations: [
    Registration,
  ],
  imports: [
    IonicPageModule.forChild(Registration),
  ],
  exports: [
    Registration
  ],
  providers: [AuthProvider, HttpClient, ProfileProvider, Facebook, Camera, Transfer, CloudinaryProvider]
})
export class RegistrationModule { }
