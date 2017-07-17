import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlagComponent } from './flag.component';
import { FlagRoutes } from "./flag.routing";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FlagRoutes),
  ],
  declarations: [FlagComponent]
})
export class FlagModule { }
