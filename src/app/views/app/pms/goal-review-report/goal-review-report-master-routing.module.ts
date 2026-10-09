import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalReviewReportComponent } from './goal-review-report.component';


const routes: Routes = [
  { path: '', component: GoalReviewReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalReviewReportMasterRoutingModule { }
