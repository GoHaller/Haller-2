import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Profile } from './profile';
import { ProfileProvider } from "../../shared/providers/profile.provider";


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
  providers: [ProfileProvider]
})
export class ProfileModule { }
