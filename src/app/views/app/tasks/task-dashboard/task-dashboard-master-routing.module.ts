import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskDashboardComponent } from './task-dashboard.component';


const routes: Routes = [
  { path: '', component: TaskDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskDashboardMasterRoutingModule { }
