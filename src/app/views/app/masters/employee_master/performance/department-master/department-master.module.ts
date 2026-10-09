import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentMasterRoutingModule } from './department-master-routing.module';
import { DepartmentComponent } from './department/department.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [DepartmentComponent],
  imports: [
    CommonModule,
    DepartmentMasterRoutingModule,
    TranslateModule
  ]
})
export class DepartmentMasterModule { }
