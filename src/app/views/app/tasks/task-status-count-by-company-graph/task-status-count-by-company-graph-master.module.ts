import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskStatusCountByCompanyGraphMasterRoutingModule } from './task-status-count-by-company-graph-master-routing.module';
import { TaskStatusCountByCompanyGraphComponent } from './task-status-count-by-company-graph.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [TaskStatusCountByCompanyGraphComponent],
  imports: [
    CommonModule,
    TaskStatusCountByCompanyGraphMasterRoutingModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [TaskStatusCountByCompanyGraphComponent]
})
export class TaskStatusCountByCompanyGraphMasterModule { }
