import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutes } from "./users.routing";
import { RouterModule } from "@angular/router";

import { UserService } from '../../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
  ],
  declarations: [UsersComponent],
  providers: [UserService]
})
export class UsersModule { }
