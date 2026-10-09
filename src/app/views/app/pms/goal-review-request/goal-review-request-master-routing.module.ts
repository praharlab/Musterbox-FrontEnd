import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGoalReviewRequestComponent } from './list-goal-review-request/list-goal-review-request.component';
import { AddGoalReviewRequestComponent } from './add-goal-review-request/add-goal-review-request.component';
import { EditGoalReviewRequestComponent } from './edit-goal-review-request/edit-goal-review-request.component';


const routes: Routes = [
  { path: '', component: ListGoalReviewRequestComponent },
  { path: 'add_goalReviewRequest', component: AddGoalReviewRequestComponent },
  { path: 'edit_goalReviewRequest', component: EditGoalReviewRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalReviewRequestMasterRoutingModule { }
