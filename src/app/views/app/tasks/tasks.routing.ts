import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { TaskMasterComponent } from './task-master/task-master.component';
import { TaskStagesComponent } from './task-stages/task-stages.component';
import { ImportTaskStagesComponent } from './import-task-stages/import-task-stages.component';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      { path: '', redirectTo: 'task_master', pathMatch: 'full' },
      { path: 'task_master', component: TaskMasterComponent },

      { path: 'dailyTask', loadChildren: () => import('./daily-task/daily-task-master.module').then((m) => m.DailyTaskMasterModule) },

      { path: 'user_dailyTask', loadChildren: () => import('./user-daily-task/user-daily-task-master.module').then((m) => m.UserDailyTaskMasterModule) },

      { path: 'task', loadChildren: () => import('./task/task-master.module').then((m) => m.TaskMasterModule) },

      { path: 'task_stages', component: TaskStagesComponent },
      { path: 'import_task_stages', component: ImportTaskStagesComponent },

      { path: 'Team-Daily-Reporting', loadChildren: () => import('./team-daily-reporting/team-daily-reporting-master.module').then((m) => m.TeamDailyReportingMasterModule) },
     
      { path: 'myTask', loadChildren: () => import('./my-tasks/my-tasks-master.module').then((m) => m.MyTasksMasterModule) },

      { path: 'taskDashboard', loadChildren: () => import('./task-dashboard/task-dashboard-master.module').then((m) => m.TaskDashboardMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
