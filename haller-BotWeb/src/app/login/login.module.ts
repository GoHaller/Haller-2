import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routing';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(LoginRoutes),
  ],
  declarations: [LoginComponent],
  providers: [AuthService]
})
export class LoginModule { }
