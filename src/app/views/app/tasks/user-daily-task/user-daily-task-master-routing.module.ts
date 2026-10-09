import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDailyTaskComponent } from './user-daily-task.component';


const routes: Routes = [
  { path: '', component: UserDailyTaskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDailyTaskMasterRoutingModule { }
