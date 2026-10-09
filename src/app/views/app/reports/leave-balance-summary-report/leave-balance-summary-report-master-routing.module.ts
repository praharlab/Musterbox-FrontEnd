import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveBalanceSummaryReportComponent } from './leave-balance-summary-report.component';


const routes: Routes = [
  { path: '', component: LeaveBalanceSummaryReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveBalanceSummaryReportMasterRoutingModule { }
