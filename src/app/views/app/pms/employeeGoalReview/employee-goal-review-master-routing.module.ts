import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeGoalReviewComponent } from './list-employee-goal-review/list-employee-goal-review.component';
import { AddEmployeeGoalReviewComponent } from './add-employee-goal-review/add-employee-goal-review.component';


const routes: Routes = [
  { path: '', component: ListEmployeeGoalReviewComponent },
  { path: 'add_goalReview', component: AddEmployeeGoalReviewComponent },
  // { path: 'edit_goalReview', component: EditEmployeeGoalReviewComponent },// not in use
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeGoalReviewMasterRoutingModule { }
