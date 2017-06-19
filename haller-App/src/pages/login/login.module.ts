import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { Facebook } from '@ionic-native/facebook';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Login } from './login';
import { LoginProvider } from './login.provider'
import { HttpClient } from '../../shared/providers/http-client'

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
    LoginProvider, HttpClient, LocalNotifications
  ]
})
export class LoginModule { }
