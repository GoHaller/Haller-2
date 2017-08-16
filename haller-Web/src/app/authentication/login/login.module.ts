import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';
import { AuthService } from "../../../services/auth.service";
import { ModalService } from "../../../services/modal.service";
import { forgotModel } from "../../modal/forgot.component";
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routing';
import { UserService } from '../../../services/user.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LoginRoutes),
        FormsModule
    ],
    declarations: [LoginComponent,forgotModel],
    providers: [AuthService,ModalService,UserService]
})

export class LoginModule { }
