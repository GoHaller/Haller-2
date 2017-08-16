import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotComponent } from './forgot.component';
import { ForgotRoutes } from "./forgot.routing";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [FormsModule,
    CommonModule,
    RouterModule.forChild(ForgotRoutes),
  ],
  declarations: [ForgotComponent]
})
export class ForgotModule { }
