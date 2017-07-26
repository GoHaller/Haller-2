import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlagComponent } from './flag.component';
import { FlagRoutes } from "./flag.routing";
import { RouterModule } from "@angular/router";
import {Ng2PaginationModule} from 'ng2-pagination';

import { PostService } from '../../services/post.services';
import { ModalService } from "services/modal.service";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(FlagRoutes),
    Ng2PaginationModule
  ],
  declarations: [FlagComponent],
  providers: [PostService, ModalService]
})
export class FlagModule { }
