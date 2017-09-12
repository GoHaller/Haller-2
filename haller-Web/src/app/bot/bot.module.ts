import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from "../shared/shared.module";
import { BotComponent } from './bot.component';
import { BotRoutes } from './bot.routing';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(BotRoutes),
        FormsModule
    ],
    declarations: [BotComponent],
    providers: [UserService, ModalService]
})

export class BotModule { }