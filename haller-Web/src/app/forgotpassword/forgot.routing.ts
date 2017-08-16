import { Routes } from '@angular/router';

import { ForgotComponent } from './forgot.component';

export const ForgotRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: ForgotComponent
    }]
  }
];
