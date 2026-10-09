import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceReviewReportComponent } from './performance-review-report.component';


const routes: Routes = [
  { path: '', component: PerformanceReviewReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeformanceReviewReportMasterRoutingModule { }
