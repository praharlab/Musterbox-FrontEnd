import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';
import { DefaultComponent } from './default/default.component';

import { PunchInTodayComponent } from './punch-in-today/punch-in-today.component'


  
const routes: Routes = [
  {
    path: '',
    component: DashboardsComponent,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      {
        path: 'default',
        component: DefaultComponent,
        // data: { roles: [UserRole.Admin] },
      },
      {
        path: 'analytics',
        loadChildren: () => import('./analytics/analytics.module').then((m) => m.AnalyticsModule)
        // data: { roles: [UserRole.Admin, UserRole.Editor] },
      },
      {
        path: 'hr-dashboard', loadChildren: () => import('../payrolls/hr-dashboard/hr-dashboard.module').then((m) => m.HrDashboardModule)
      },
      {
        path:'PunchInToday',
        component:PunchInTodayComponent
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule { }
