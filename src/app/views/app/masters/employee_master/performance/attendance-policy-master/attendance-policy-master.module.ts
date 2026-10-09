import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendancePolicyMasterRoutingModule } from './attendance-policy-master-routing.module';
import { EmployeeAttendancePolicyComponent } from '../../employee-attendance-policy/employee-attendance-policy.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ViewEmployeeAttendancePolicyComponent } from '../../employee-attendance-policy/view-employee-attendance-policy/view-employee-attendance-policy.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [EmployeeAttendancePolicyComponent, ViewEmployeeAttendancePolicyComponent],
  imports: [
    CommonModule,
    AttendancePolicyMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
  ],
  exports: [EmployeeAttendancePolicyComponent, ViewEmployeeAttendancePolicyComponent]
})
export class AttendancePolicyMasterModule { }
