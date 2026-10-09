import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitReportSummaryComponent } from './visit-report-summary.component';


const routes: Routes = [
  { path: '', component: VisitReportSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitReportSummaryMasterRoutingModule { }
