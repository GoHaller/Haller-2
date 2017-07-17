import { Routes } from '@angular/router';

import { FlagComponent } from './flag.component';

export const FlagRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: FlagComponent
    }]
  }
];
