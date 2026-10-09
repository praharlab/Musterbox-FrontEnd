import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsToMasterRoutingModule } from './reports-to-master-routing.module';
import { ReportsToComponent } from './reports-to/reports-to.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ReportsToComponent],
  imports: [
    CommonModule,
    ReportsToMasterRoutingModule,
    FormsModule
  ]
})
export class ReportsToMasterModule { }
