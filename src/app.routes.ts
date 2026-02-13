import { Routes } from '@angular/router';
import { MainLayouts } from './app/layouts/page/main-layouts/main-layouts';

// หมายเหตุ: ไม่ต้อง Import Component ของหน้าย่อยๆ ด้านบนแล้ว เพราะเราย้ายไปโหลดแบบ Lazy Loading ข้างล่างแทน

export const appRoutes: Routes = [
    {
        path: '',
        component: MainLayouts,
        children: [
            // Redirect
            { path: '', redirectTo: 'manage-asset', pathMatch: 'full' },

            // ✅ ปรับกลุ่ม Manage Asset เป็น Lazy Loading ทั้งหมด
            {
                path: 'manage-asset',
                loadComponent: () => import('./app/manage-asset/page/request-action/request-action')
                    .then(m => m.RequestAction)
            },
            {
                path: 'manage-asset/history',
                loadComponent: () => import('./app/manage-asset/page/request-history-list/request-history-list')
                    .then(m => m.RequestHistoryList)
            },
            {
                path: 'manage-asset/new',
                loadComponent: () => import('./app/manage-asset/page/new-request/new-request')
                    .then(m => m.NewRequest)
            },
            {
                path: 'manage-asset/edit',
                loadComponent: () => import('./app/manage-asset/page/edit-request/edit-request')
                    .then(m => m.EditRequest)
            },
            {
                path: 'manage-asset/dispose',
                loadComponent: () => import('./app/manage-asset/page/dispose-request/dispose-request')
                    .then(m => m.DisposeRequest)
            },

            // ✅ กลุ่ม Expert (Lazy Loading เดิม)
            {
                path: 'expert',
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('@/app/expert/page/expert-dashboard/expert-dashboard')
                            .then(m => m.ExpertDashboard)
                    },
                    {
                        path: 'review-new/:id',
                        loadComponent: () => import('@/app/expert/page/expert-review-new/expert-review-new')
                            .then(m => m.ExpertReviewNew)
                    },
                    {
                        path: 'review-edit/:id',
                        loadComponent: () => import('@/app/expert/page/expert-review-edit/expert-review-edit')
                            .then(m => m.ExpertReviewEdit)
                    },
                ]
            }
        ]
    },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // { path: '**', redirectTo: '/notfound' }
];