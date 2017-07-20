import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';
import { AuthService } from "../../../services/auth.service";

import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LoginRoutes),
        FormsModule
    ],
    declarations: [LoginComponent],
    providers: [AuthService]
})

export class LoginModule { }
