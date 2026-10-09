import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyTaskComponent } from './daily-task.component';


const routes: Routes = [
  { path: '', component: DailyTaskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyTaskMasterRoutingModule { }
