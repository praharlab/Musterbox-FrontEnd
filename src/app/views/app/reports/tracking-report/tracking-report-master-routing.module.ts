import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingReportComponent } from './tracking-report.component';


const routes: Routes = [
  { path: '', component: TrackingReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingReportMasterRoutingModule { }
