import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeAttendanceBonusPolicyMasterRoutingModule } from './employee-attendance-bonus-policy-master-routing.module';
import { ViewEmployeeAttendanceBonusPolicyComponent } from './view-employee-attendance-bonus-policy/view-employee-attendance-bonus-policy.component';
import { EmployeeAttendanceBonusPolicyComponent } from './employee-attendance-bonus-policy/employee-attendance-bonus-policy.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ViewEmployeeAttendanceBonusPolicyComponent, EmployeeAttendanceBonusPolicyComponent],
  imports: [
    CommonModule,
    EmployeeAttendanceBonusPolicyMasterRoutingModule,
    ModalModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [ViewEmployeeAttendanceBonusPolicyComponent, EmployeeAttendanceBonusPolicyComponent]
})
export class EmployeeAttendanceBonusPolicyMasterModule { }
