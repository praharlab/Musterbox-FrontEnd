import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskStatusCountByUserGraphMasterRoutingModule } from './task-status-count-by-user-graph-master-routing.module';
import { TaskStatusCountByUsersGraphComponent } from './task-status-count-by-users-graph.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [TaskStatusCountByUsersGraphComponent],
  imports: [
    CommonModule,
    TaskStatusCountByUserGraphMasterRoutingModule,
    FormsModule,
    NgSelectModule,
    
  ],
  exports: [TaskStatusCountByUsersGraphComponent]
})
export class TaskStatusCountByUserGraphMasterModule { }
