import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGoalSettingComponent } from './list-goal-setting/list-goal-setting.component';
import { AddGoalSettingComponent } from './add-goal-setting/add-goal-setting.component';
import { EditGoalSettingComponent } from './edit-goal-setting/edit-goal-setting.component';


const routes: Routes = [
  { path: '', component: ListGoalSettingComponent },
  { path: 'add_goalsetting', component: AddGoalSettingComponent },
  { path: 'edit_goalsetting', component: EditGoalSettingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalSettingMasterRoutingModule { }
