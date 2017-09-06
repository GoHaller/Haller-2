import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BotComponent } from './bot.component';
import { BotRoutes } from './bot.routing';
import { UserService } from '../../services/user.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BotRoutes),
        FormsModule
    ],
    declarations: [BotComponent],
    providers: [UserService]
})

export class BotModule { }
