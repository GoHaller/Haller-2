import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Registration } from './registration';
import { RegistrationProvider } from "./registration.provider";
import { HttpClient } from '../../shared/providers/http-client';
import { ProfileEditProvider } from "../profile-edit/profile-edit.provider";

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
  providers: [RegistrationProvider, HttpClient, ProfileEditProvider]
})
export class RegistrationModule { }
