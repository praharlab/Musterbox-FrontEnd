import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiveMinuteGapTrackingReportComponent } from './five-minute-gap-tracking-report.component';


const routes: Routes = [
  { path: '', component: FiveMinuteGapTrackingReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiveMinuteGapTrackingReportMasterRoutingModule { }
