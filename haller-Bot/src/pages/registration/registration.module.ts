import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Registration } from './registration';
import { AuthProvider } from "../../providers/auth-provider";

@NgModule({
  declarations: [
    Registration,
  ],
  imports: [
    IonicPageModule.forChild(Registration),
  ],
  providers: [AuthProvider]
})
export class RegistrationModule { }
