import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Profile } from './profile';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { AuthProvider } from "../../shared/providers/auth.provider";


@NgModule({
  declarations: [
    Profile,
  ],
  imports: [
    IonicPageModule.forChild(Profile),
  ],
  exports: [
    Profile
  ],
  providers: [ProfileProvider,Facebook,AuthProvider]
})
export class ProfileModule { }
