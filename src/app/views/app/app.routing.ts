import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PerformanceComponent } from './masters/employee_master/performance/performance.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboards' },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then((m) => m.TasksModule),
      },
      {
        path: 'orgs',
        loadChildren: () => import('./orgs/orgs.module').then((m) => m.OrgsModule),
      },
      {
        path: 'utilitys',
        loadChildren: () => import('./utilitys/utilitys.module').then((m) => m.UtilitysModule),
      },
      {
        path: 'visits',
        loadChildren: () => import('./visits/visits.module').then((m) => m.VisitsModule),
      },
      {
        path: 'myteam',
        loadChildren: () => import('./myteam/myteam.module').then((m) => m.MyteamModule),
      },
      {
        path: 'preboardings',
        loadChildren: () =>
          import('./preboardings/preboardings.module').then((m) => m.PreboardingsModule),
      },
      {
        path: 'offboardings',
        loadChildren: () =>
          import('./offboardings/offboardings.module').then((m) => m.OffboardingsModule),
      },

      {
        path: 'finances',
        loadChildren: () => import('./finances/finances.module').then((m) => m.FinancesModule),
      },
      {
        path: 'attendances',
        loadChildren: () =>
          import('./attendances/attendances.module').then((m) => m.AttendancesModule),
      },
      {
        path: 'assets',
        loadChildren: () => import('./assets/assets.module').then((m) => m.AssetsModule),
      },

      {
        path: 'overtimes',
        loadChildren: () => import('./overtimes/overtimes.module').then((m) => m.OvertimesModule),
      },

      {
        path: 'payrolls',
        loadChildren: () => import('./payrolls/payrolls.module').then((m) => m.PayrollsModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'skillsets',
        loadChildren: () => import('./skillsets/skillsets.module').then((m) => m.SkillsetsModule),
      },

      {
        path: 'govtreports',
        loadChildren: () =>
          import('./govtreports/govtreports.module').then((m) => m.GovtreportsModule),
      },
      {
        path: 'gatepasses',
        loadChildren: () =>
          import('./gatepasses/gatepasses.module').then((m) => m.GatepassesModule),
      },
      {
        path: 'masters',
        loadChildren: () => import('./masters/masters.module').then((m) => m.MastersModule),
      },

      {
        path: 'superadminmenus',
        loadChildren: () =>
          import('./superadminmenus/superadminmenus.module').then((m) => m.SuperadminmenusModule),
      },

      {
        path: 'checklists',
        loadChildren: () =>
          import('./checklists/checklists.module').then((m) => m.ChecklistsModule),
      },

      {
        path: 'tickets',
        loadChildren: () => import('./tickets/tickets.module').then((m) => m.TicketsModule),
      },

      {
        path: 'form16s',
        loadChildren: () => import('./form16s/form16s.module').then((m) => m.Form16sModule),
      },
      {
        path: 'moodTrackers',
        loadChildren: () =>
          import('./moodTracker/moodtracker.module').then((m) => m.MoodTrackerModule),
      },
      {
        path: 'pms',
        loadChildren: () => import('./pms/pms.module').then((m) => m.PmsModule),
      },

      {
        path: 'incometax',
        loadChildren: () => import('./income-tax/income-tax.module').then((m) => m.IncomeTaxModule),
      },

      {
        path: 'employeegatepasses',
        loadChildren: () =>
          import('./employee-gatepass/employee-gatepass.module').then(
            (m) => m.EmployeeGatepassModule,
          ),
      },
      {
        path: 'userprofile',
        loadChildren: () =>
          import('./userprofile/userprofile.module').then((m) => m.UserprofileModule),
      },

      { path: 'notification', component: NotificationComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'me', loadChildren: () => import('./masters/employee_master/performance/me-master.module').then((m) => m.MeMasterModule) },
      // { path: 'me', component: PerformanceComponent },
      { path: 'reuqestInbox',loadChildren: () =>
        import('./list-user-request-box/list-user-request-box.module').then((m) => m.ListUserRequestBoxModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
