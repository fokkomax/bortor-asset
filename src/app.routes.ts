import { Routes } from '@angular/router';
// import { Landing } from './app/pages/landing/landing';
// import { Notfound } from './app/pages/notfound/notfound';
import { MainDashboard } from './app/dashboard/page/main-dashboard/main-dashboard';
import { MainLayouts } from './app/layouts/page/main-layouts/main-layouts';
import { RequestAction } from './app/manage-asset/page/request-action/request-action';
import { RequestHistoryList } from './app/manage-asset/page/request-history-list/request-history-list';
import { NewRequest } from './app/manage-asset/page/new-request/new-request';
import { EditRequest } from './app/manage-asset/page/edit-request/edit-request';
import { DisposeRequest } from './app/manage-asset/page/dispose-request/dispose-request';

export const appRoutes: Routes = [
    {
        path: '',
        component: MainLayouts,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: MainDashboard },
            { path: 'manage-asset', component: RequestAction },
            { path: 'manage-asset/history', component: RequestHistoryList },
            { path: 'manage-asset/new', component: NewRequest },
            { path: 'manage-asset/edit', component: EditRequest },
            { path: 'manage-asset/dispose', component: DisposeRequest },
        ]
    },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // { path: '**', redirectTo: '/notfound' }
];
