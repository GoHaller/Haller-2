import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import {AuthGuard} from '../guard/auth.guard';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
                canActivate: [AuthGuard]
            }, {
                path: 'users',
                loadChildren: './users/users.module#UsersModule',
                canActivate: [AuthGuard]
            }, {
                path: 'bot-conversations',
                loadChildren: './bot/bot.module#BotModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'notifications',
                loadChildren: './notification/notification.module#NotificationModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'components',
                loadChildren: './components/components.module#ComponentsModule',
                canActivate: [AuthGuard]
            }, {
                path: 'forms',
                loadChildren: './forms/forms.module#Forms',
                canActivate: [AuthGuard]
            }, {
                path: 'tables',
                loadChildren: './tables/tables.module#TablesModule',
                canActivate: [AuthGuard]
            }, {
                path: 'maps',
                loadChildren: './maps/maps.module#MapsModule',
                canActivate: [AuthGuard]
            }, {
                path: 'widgets',
                loadChildren: './widgets/widgets.module#WidgetsModule',
                canActivate: [AuthGuard]
            }, {
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule',
                canActivate: [AuthGuard]
            }, {
                path: 'calendar',
                loadChildren: './calendar/calendar.module#CalendarModule',
                canActivate: [AuthGuard]
            }, {
                path: '',
                loadChildren: './userpage/user.module#UserModule',
                canActivate: [AuthGuard]
            }, {
                path: '',
                loadChildren: './timeline/timeline.module#TimelineModule',
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    }
];
