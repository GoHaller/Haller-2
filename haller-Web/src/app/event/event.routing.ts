import { Routes } from '@angular/router';

import { EventComponent } from './event.component';

export const EventRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: EventComponent
    }]
  }
];
