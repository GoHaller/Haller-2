import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed.component';
import { FeedRoutes } from "./feed.routing";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import {Ng2PaginationModule} from 'ng2-pagination';

import { ModalComponent } from '../modal/modal.component';
import { ModalService } from "../../services/modal.service";
import { PostService } from '../../services/post.services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(FeedRoutes),
    Ng2PaginationModule
  ],
  declarations: [FeedComponent, ModalComponent],
  providers: [PostService, ModalService]
})
export class FeedModule { }
