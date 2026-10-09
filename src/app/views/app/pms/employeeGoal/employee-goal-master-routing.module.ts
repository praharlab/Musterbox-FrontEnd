import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeGoalComponent } from './list-employee-goal/list-employee-goal.component';
import { AddEmployeeGoalComponent } from './add-employee-goal/add-employee-goal.component';
import { EditEmployeeGoalComponent } from './edit-employee-goal/edit-employee-goal.component';


const routes: Routes = [
  { path: '', component: ListEmployeeGoalComponent },
  { path: 'add_empgoal', component: AddEmployeeGoalComponent },
  { path: 'edit_empgoal', component: EditEmployeeGoalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeGoalMasterRoutingModule { }
