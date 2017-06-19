import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePassword } from './change-password';
import { LoginProvider } from '../login/login.provider';
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
    LoginProvider, HttpClient
  ]
})
export class ChangePasswordModule { }
