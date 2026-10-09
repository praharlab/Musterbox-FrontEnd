import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceCorrectionReportComponent } from './attendance-correction-report.component';


const routes: Routes = [
  { path: '', component: AttendanceCorrectionReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceCorrectionReportRoutingModule { }
