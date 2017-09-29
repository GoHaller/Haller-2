import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPolicy } from './privacy-policy';

@NgModule({
  declarations: [
    PrivacyPolicy,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPolicy),
  ],
})
export class PrivacyPolicyModule {}
