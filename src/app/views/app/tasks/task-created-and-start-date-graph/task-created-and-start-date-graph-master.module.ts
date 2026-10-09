import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskCreatedAndStartDateGraphMasterRoutingModule } from './task-created-and-start-date-graph-master-routing.module';
import { TaskCreatedAndStartDateGraphComponent } from './task-created-and-start-date-graph.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TaskCreatedAndStartDateGraphComponent],
  imports: [
    CommonModule,
    TaskCreatedAndStartDateGraphMasterRoutingModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [TaskCreatedAndStartDateGraphComponent]
})
export class TaskCreatedAndStartDateGraphMasterModule { }
