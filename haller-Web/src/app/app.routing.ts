import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            }, {
                path: 'analitics-dashboard',
                loadChildren: './analitics-dashboard/analitics-dashboard.module#AnaliticsDashboardModule'
            }, {
                path: 'feed',
                loadChildren: './feed/feed.module#FeedModule'
            }, {
                path: 'event',
                loadChildren: './event/event.module#EventModule'
            }, {
                path: 'flag-section',
                loadChildren: './flag/flag.module#FlagModule'
            }, {
                path: 'users',
                loadChildren: './users/users.module#UsersModule'
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
    }
];

/*
{
    path: 'components',
    loadChildren: './components/components.module#ComponentsModule'
}, {
    path: 'forms',
    loadChildren: './forms/forms.module#Forms'
}, {
    path: 'tables',
    loadChildren: './tables/tables.module#TablesModule'
}, {
    path: 'maps',
    loadChildren: './maps/maps.module#MapsModule'
}, {
    path: 'widgets',
    loadChildren: './widgets/widgets.module#WidgetsModule'
}, {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsModule'
}, {
    path: 'calendar',
    loadChildren: './calendar/calendar.module#CalendarModule'
}, {
    path: '',
    loadChildren: './userpage/user.module#UserModule'
}, {
    path: '',
    loadChildren: './timeline/timeline.module#TimelineModule'
}
*/
