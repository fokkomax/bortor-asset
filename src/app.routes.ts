import { Routes } from '@angular/router';
// import { Landing } from './app/pages/landing/landing';
// import { Notfound } from './app/pages/notfound/notfound';
import { MainDashboard } from './app/dashboard/page/main-dashboard/main-dashboard';
import { MainLayouts } from './app/layouts/page/main-layouts/main-layouts';
import { RequestAction } from './app/manage-asset/page/request-action/request-action';
import { RequestHistoryList } from './app/manage-asset/page/request-history-list/request-history-list';

export const appRoutes: Routes = [
    {
        path: '',
        component: MainLayouts,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: MainDashboard },
            { path: 'manage-asset', component: RequestAction },
            { path: 'manage-asset/history', component: RequestHistoryList },
        ]
    },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // { path: '**', redirectTo: '/notfound' }
];
