import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingTaskPercentageWiseGraphMasterRoutingModule } from './pending-task-percentage-wise-graph-master-routing.module';
import { PendingTaskPercentageWiseGraphComponent } from './pending-task-percentage-wise-graph.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PendingTaskPercentageWiseGraphComponent],
  imports: [
    CommonModule,
    PendingTaskPercentageWiseGraphMasterRoutingModule,
    FormsModule
  ],
  exports: [PendingTaskPercentageWiseGraphComponent]
})
export class PendingTaskPercentageWiseGraphMasterModule { }
