import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveUpdateReportComponent } from './leave-update-report.component';


const routes: Routes = [
  { path: '', component: LeaveUpdateReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveUpdateReportMasterRoutingModule { }
