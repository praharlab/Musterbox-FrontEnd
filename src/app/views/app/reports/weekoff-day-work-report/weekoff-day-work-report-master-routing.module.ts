import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeekoffDayWorkReportComponent } from './weekoff-day-work-report.component';


const routes: Routes = [
  { path: '', component: WeekoffDayWorkReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekoffDayWorkReportMasterRoutingModule { }
