import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPerformanceReviewComponent } from './list-performance-review/list-performance-review.component';
import { AddPerformanceReviewComponent } from './add-performance-review/add-performance-review.component';
import { EditPerformanceReviewComponent } from './edit-performance-review/edit-performance-review.component';

const routes: Routes = [
  { path: '', component: ListPerformanceReviewComponent },
  { path: 'addPerformanceReview', component: AddPerformanceReviewComponent },
  { path: 'editPerformanceReview', component: EditPerformanceReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceReviewRoutingModule {}
