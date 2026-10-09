import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceReportComponent } from './attendance-report.component';


const routes: Routes = [
  { path: '', component: AttendanceReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceReportMasterRoutingModule { }
