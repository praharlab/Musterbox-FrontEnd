import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistinctLocationsTrackingReportComponent } from './distinct-locations-tracking-report.component';


const routes: Routes = [
  { path: '', component: DistinctLocationsTrackingReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistinctLocationstrackingReportMasterRoutingModule { }
