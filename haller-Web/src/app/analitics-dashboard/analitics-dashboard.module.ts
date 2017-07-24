import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnaliticsDashboardComponent } from './analitics-dashboard.component';
import { AnaliticsDashboardRoutes } from "./analitics-dashboard.routing";
import { RouterModule } from "@angular/router";
import { PostService } from '../../services/post.services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AnaliticsDashboardRoutes),
  ],
  declarations: [AnaliticsDashboardComponent],
  providers: [PostService]
})
export class AnaliticsDashboardModule { }
