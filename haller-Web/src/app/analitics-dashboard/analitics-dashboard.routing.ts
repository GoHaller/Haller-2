import { Routes } from '@angular/router';

import { AnaliticsDashboardComponent } from './analitics-dashboard.component';

export const AnaliticsDashboardRoutes: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: AnaliticsDashboardComponent
        }]
    }
];
