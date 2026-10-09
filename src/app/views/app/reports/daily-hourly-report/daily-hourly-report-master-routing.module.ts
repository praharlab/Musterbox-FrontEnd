import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyHourlyReportComponent } from './daily-hourly-report.component';


const routes: Routes = [
  { path: '', component: DailyHourlyReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyHourlyReportMasterRoutingModule { }
