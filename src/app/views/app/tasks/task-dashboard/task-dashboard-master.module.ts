import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskDashboardMasterRoutingModule } from './task-dashboard-master-routing.module';
import { TaskDashboardComponent } from './task-dashboard.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PendingTaskPercentageWiseGraphMasterModule } from '../pending-task-percentage-wise-graph/pending-task-percentage-wise-graph-master.module';
import { TaskCreatedAndStartDateGraphMasterModule } from '../task-created-and-start-date-graph/task-created-and-start-date-graph-master.module';
import { TaskStatusCountByCompanyGraphMasterModule } from '../task-status-count-by-company-graph/task-status-count-by-company-graph-master.module';
import { TaskStatusCountByUserGraphMasterModule } from '../task-status-count-by-users-graph/task-status-count-by-user-graph-master.module';


@NgModule({
  declarations: [TaskDashboardComponent],
  imports: [
    CommonModule,
    TaskDashboardMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    PendingTaskPercentageWiseGraphMasterModule,
    TaskCreatedAndStartDateGraphMasterModule,
    TaskStatusCountByCompanyGraphMasterModule,
    TaskStatusCountByUserGraphMasterModule
  ]
})
export class TaskDashboardMasterModule { }
