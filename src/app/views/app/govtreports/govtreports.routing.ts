import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GovtreportsComponent } from './govtreports.component';
import { GovReportMasterComponent } from './gov-report-master/gov-report-master.component';

const routes: Routes = [
  {
    path: '',
    component: GovtreportsComponent,
    children: [
      { path: '', redirectTo: 'govreport_master', pathMatch: 'full' },
      { path: 'govreport_master', component: GovReportMasterComponent },
      { path: 'pa-muster-roll', loadChildren: () => import('./pa-muster-roll/pa-muster-roll-master.module').then((m) => m.PaMusterRollMasterModule) },

      { path: 'inout-attendance-register', loadChildren: () => import('./inout-attendance-register/inout-attendanc-register-master.module').then((m) => m.InoutAttendancRegisterMasterModule) },

      { path: 'form5', loadChildren: () => import('./form5/form5-master.module').then((m) => m.Form5MasterModule) },

      { path: 'identitycardregister', loadChildren: () => import('./identitycardregister/identity-card-register-master.module').then((m) => m.IdentityCardRegisterMasterModule) },
      
      { path: 'adultworkersregister', loadChildren: () => import('./adultworkersregister/adult-workers-register-master.module').then((m) => m.AdultWorkersRegisterMasterModule) },
      
      { path: 'form18', loadChildren: () => import('./form18/form18-master.module').then((m) => m.Form18MasterModule) },
      
      { path: 'form4', loadChildren: () => import('./form4/form4-master.module').then((m) => m.Form4MasterModule) },
      
      { path: 'form29', loadChildren: () => import('./form29/form29-master.module').then((m) => m.Form29MasterModule) },
      
      { path: 'form1', loadChildren: () => import('./form1/form1-master.module').then((m) => m.Form1MasterModule) },
      
      { path: 'form7', loadChildren: () => import('./form7/form7-master.module').then((m) => m.Form7MasterModule) },
      
      { path: 'form11', loadChildren: () => import('./form11/form11-master.module').then((m) => m.Form11MasterModule) },
      
      { path: 'form14', loadChildren: () => import('./form14/form14-master.module').then((m) => m.Form14MasterModule) },
      
      { path: 'form21', loadChildren: () => import('./form21/form21-master.module').then((m) => m.Form21MasterModule) },
      
      { path: 'formA', loadChildren: () => import('./form-a/form-amaster.module').then((m) => m.FormAMasterModule) },
      
      { path: 'formB', loadChildren: () => import('./form-b/form-bmaster.module').then((m) =>m.FormBMasterModule) },
      
      { path: 'formC', loadChildren: () => import('./form-c/form-cmaster.module').then((m) => m.FormCMasterModule) },
      
      { path: 'form-er01', loadChildren: () => import('./form-er01/form-er01-master.module').then((m) => m.FormEr01MasterModule) },
      
      { path: 'lwf_report', loadChildren: () => import('./lwf-report/lwf-report-master.module').then((m) => m.LwfReportMasterModule) },
      
      { path: 'attendanceData_report', loadChildren: () => import('./attendance-data-report/attendance-data-report-master.module').then((m) => m.AttendanceDataReportMasterModule) },
      
      { path: 'form28', loadChildren: () => import('./form28/form28-master.module').then((m) => m.Form28MasterModule) }
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GovtreportsRoutingModule { }
