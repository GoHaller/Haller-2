import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from './settings';
import { AuthProvider } from "../../providers/auth-provider";

@NgModule({
  declarations: [
    Settings,
  ],
  imports: [
    IonicPageModule.forChild(Settings),
  ],
  providers: [AuthProvider]
})
export class SettingsModule { }
