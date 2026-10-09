import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OvertimesComponent } from './overtimes.component';
import { OvertimeMasterComponent } from './overtime-master/overtime-master.component';
import { CompanyOvertimeDataComponent } from './company-overtime-data/company-overtime-data.component';

const routes: Routes = [
  {
    path: '',
    component: OvertimesComponent,
    children: [
      { path: '', redirectTo: 'overtime_master', pathMatch: 'full' },

      { path: 'overtime_master', component: OvertimeMasterComponent },

      { path: 'overtime', loadChildren: () => import('./overtime/overtime-master.module').then((m) => m.OvertimeMasterModule) },

      { path: 'overtime_request/:id', loadChildren: () => import('./overtimerequest/overtime-request-master.module').then((m) => m.OvertimeRequestMasterModule) },

      { path: 'overtime_calculation', loadChildren: () => import('./overtime-calculation/overtime-calculation-master.module').then((m) => m.OvertimeCalculationMasterModule) },

      { path: 'overtime-report', loadChildren: () => import('./overtime-report/overtime-report-master.module').then((m) => m.OvertimeReportMasterModule) },

      { path: 'overtime_report_userwise', loadChildren: () => import('./overtime-report-userwise/overtime-report-userwise-master.module').then((m) => m.OvertimeReportUserwiseMasterModule) },

      { path: 'consolidate_overtime_report', loadChildren: () => import('./overtime-consolidate-report/overtime-consolidate-report-master.module').then((m) =>m.OvertimeConsolidateReportMasterModule) },

      { path: 'company_overtimedata', component: CompanyOvertimeDataComponent },
      
      { path: 'daily_ot_report', loadChildren: () => import('./daily-ot-report/daily-overtime-report-master.module').then((m) => m.DailyOvertimeReportMasterModule) }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvertimesRoutingModule { }
