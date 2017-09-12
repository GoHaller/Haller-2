import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnaliticsComponent } from './analitics.component';
import { AnaliticsRoutes } from "./analitics.routing";
import { RouterModule } from "@angular/router";
import { UserService } from '../../services/user.service';
import { ModalService } from "../../services/modal.service";
import { Ng2PaginationModule } from 'ng2-pagination';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AnaliticsRoutes),
        Ng2PaginationModule
    ],
    declarations: [AnaliticsComponent],
    providers: [UserService, ModalService]
})
export class AnaliticsModule { }
