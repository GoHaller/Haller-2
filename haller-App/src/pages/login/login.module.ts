import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Login } from './login';
import { AuthProvider } from '../../shared/providers/auth.provider';
import { HttpClient } from '../../shared/providers/http-client';
import { ProfileProvider } from "../../shared/providers/profile.provider";

@NgModule({
  declarations: [
    Login
  ],
  imports: [
    IonicPageModule.forChild(Login),
  ],
  exports: [
    Login
  ],
  providers: [
    AuthProvider, HttpClient, LocalNotifications, ProfileProvider, Facebook
  ]
})
export class LoginModule { }
