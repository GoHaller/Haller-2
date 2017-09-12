import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Landing } from './landing';
import { Facebook } from '@ionic-native/facebook';

import { ProfileProvider } from "../../shared/providers/profile.provider";
import { AuthProvider } from "../../shared/providers/auth.provider";

@NgModule({
  declarations: [
    Landing,
  ],
  imports: [
    IonicPageModule.forChild(Landing),
  ],
  exports: [
    Landing
  ],
  providers: [ProfileProvider, AuthProvider, Facebook]
})
export class LandingModule { }
