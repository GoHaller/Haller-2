import { Routes } from '@angular/router';

import { FeedComponent } from './feed.component';

export const FeedRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: FeedComponent
    }]
  }
];
