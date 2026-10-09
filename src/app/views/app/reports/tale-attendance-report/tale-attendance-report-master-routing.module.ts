import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaleAttendanceReportComponent } from './tale-attendance-report.component';


const routes: Routes = [
  { path: '', component: TaleAttendanceReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaleAttendanceReportMasterRoutingModule { }
