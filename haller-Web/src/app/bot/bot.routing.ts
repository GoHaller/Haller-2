import { Routes } from '@angular/router';

import { BotComponent } from './bot.component';

export const BotRoutes: Routes = [
    {

        path: '',
        children: [{
            path: '',
            component: BotComponent
        }]
    }
];
