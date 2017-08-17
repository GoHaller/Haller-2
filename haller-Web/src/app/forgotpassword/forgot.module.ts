import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotComponent } from './forgot.component';
import { ForgotRoutes } from "./forgot.routing";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@NgModule({
  imports: [FormsModule,
    CommonModule,
    RouterModule.forChild(ForgotRoutes),
  ],
  declarations: [ForgotComponent],
  providers: [AuthService]
})
export class ForgotModule { }
