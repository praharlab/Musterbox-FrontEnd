import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyOtReportComponent } from './daily-ot-report.component';


const routes: Routes = [
  { path: '', component: DailyOtReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyOvertimeReportMasterRoutingModule { }
