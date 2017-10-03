import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { UsersRoutes } from "./users.routing";
import { RouterModule } from "@angular/router";

// import { SharedModule } from "../shared/shared.module";
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(UsersRoutes),
    ],
    declarations: [UsersComponent],
    providers: [UserService, ModalService]
})
export class UsersModule { }
