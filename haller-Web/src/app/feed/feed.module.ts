import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed.component';
import { FeedRoutes } from './feed.routing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ng2PaginationModule } from 'ng2-pagination';
import { SharedModule } from "../shared/shared.module";
import { ModalService } from '../../services/modal.service';
import { PostService } from '../../services/post.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(FeedRoutes),
        Ng2PaginationModule,
    ],
    declarations: [FeedComponent],
    providers: [PostService, ModalService]
})
export class FeedModule { }
