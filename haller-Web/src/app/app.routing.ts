import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'forgotpassword/:id',
        loadChildren: './forgotpassword/forgot.module#ForgotModule'
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            }, {
                path: 'analytics-dashboard',
                loadChildren: './analytics-dashboard/analitics-dashboard.module#AnaliticsDashboardModule'
            }, {
                path: 'general-newsfeed',
                loadChildren: './feed/feed.module#FeedModule'
            }, {
                path: 'events-feed',
                loadChildren: './feed/feed.module#FeedModule'
            }, {
                path: 'flag-content',
                loadChildren: './flag/flag.module#FlagModule'
            }, {
                path: 'user-list',
                loadChildren: './users/users.module#UsersModule'
            }, {
                path: 'notifications',
                loadChildren: './notification/notification.module#NotificationModule'
            }, {
                path: 'bot',
                loadChildren: './bot/bot.module#BotModule'
            }, {
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
            },
            {
                path: 'forgotpassword',
                loadChildren: './forgotpassword/forgot.module#ForgotModule'
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }, {
            path: 'login',
            loadChildren: './authentication/login/login.module#LoginModule'
        }, {
            path: 'forgotpassword',
            loadChildren: './forgotpassword/forgot.module#ForgotModule'
        }]
    }
];
