import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnaliticsDashboardComponent } from './analitics-dashboard.component';
import { AnaliticsDashboardRoutes } from "./analitics-dashboard.routing";
import { RouterModule } from "@angular/router";
import { PostService } from '../../services/post.service';
import { ModalService } from "../../services/modal.service";
import { EventJoinComponent } from "../modal/eventJoin.component";
import { Ng2PaginationModule } from 'ng2-pagination';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AnaliticsDashboardRoutes),
        Ng2PaginationModule
    ],
    declarations: [AnaliticsDashboardComponent, EventJoinComponent],
    providers: [PostService, ModalService]
})
export class AnaliticsDashboardModule { }
