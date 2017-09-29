import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePassword } from './change-password';
import { AuthProvider } from "../../providers/auth-provider";

@NgModule({
  declarations: [
    ChangePassword,
  ],
  imports: [
    IonicPageModule.forChild(ChangePassword),
  ],
  providers: [AuthProvider]
})
export class ChangePasswordModule { }
