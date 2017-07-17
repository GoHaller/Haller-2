import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnaliticsDashboardComponent } from './analitics-dashboard.component';
import { AnaliticsDashboardRoutes } from "./analitics-dashboard.routing";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AnaliticsDashboardRoutes),
  ],
  declarations: [AnaliticsDashboardComponent]
})
export class AnaliticsDashboardModule { }
