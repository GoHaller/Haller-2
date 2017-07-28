import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { ChangePassword } from './change-password';
import { AuthProvider } from '../../shared/providers/auth.provider';
import { HttpClient } from '../../shared/providers/http-client';

@NgModule({
  declarations: [
    ChangePassword,
  ],
  imports: [
    IonicPageModule.forChild(ChangePassword),
  ],
  exports: [
    ChangePassword
  ],
  providers: [
    AuthProvider, HttpClient, Facebook
  ]
})
export class ChangePasswordModule { }
