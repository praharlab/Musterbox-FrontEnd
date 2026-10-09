import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeePerformanceReviewComponent } from './list-employee-performance-review/list-employee-performance-review.component';
import { AddEmployeePerformanceReviewComponent } from './add-employee-performance-review/add-employee-performance-review.component';
import { EditEmployeePerformanceReviewComponent } from './edit-employee-performance-review/edit-employee-performance-review.component';

const routes: Routes = [
  { path: '', component: ListEmployeePerformanceReviewComponent },
  { path: 'addEmployeePerformanceReview', component: AddEmployeePerformanceReviewComponent },
  { path: 'editEmployeePerformanceReview', component: EditEmployeePerformanceReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmloyeePerformanceReviewRoutingModule {}
