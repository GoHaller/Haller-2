import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { NotificationRoutes } from "./notification.routing";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.services';
import { NotificationModalComponent } from '../modal/notificationmodal.component';
import { ModalService } from '../../services/modal.service';
import {Ng2PaginationModule} from 'ng2-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(NotificationRoutes),
    Ng2PaginationModule
  ],
  declarations: [NotificationComponent,NotificationModalComponent],
  providers: [PostService,ModalService]
})
export class NotificationModule { }
