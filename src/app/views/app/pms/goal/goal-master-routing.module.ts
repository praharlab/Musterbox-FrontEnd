import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGoalComponent } from './list-goal/list-goal.component';
import { AddGoalComponent } from './add-goal/add-goal.component';
import { EditGoalComponent } from './edit-goal/edit-goal.component';


const routes: Routes = [
  { path: '', component: ListGoalComponent },
  { path: 'add_goal', component: AddGoalComponent },
  { path: 'edit_goal', component: EditGoalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalMasterRoutingModule { }
