import { Routes } from '@angular/router';

import { AnaliticsComponent } from './analitics.component';

export const AnaliticsRoutes: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: AnaliticsComponent
        }]
    }
];
