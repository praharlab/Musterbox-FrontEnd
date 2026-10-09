import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeHolidayPolicyMasterRoutingModule } from './employee-holiday-policy-master-routing.module';
import { EmployeeHolidayPolicyComponent } from './employee-holiday-policy/employee-holiday-policy.component';
import { ViweEmployeeHolidayPolicyComponent } from './viwe-employee-holiday-policy/viwe-employee-holiday-policy.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [EmployeeHolidayPolicyComponent, ViweEmployeeHolidayPolicyComponent],
  imports: [
    CommonModule,
    EmployeeHolidayPolicyMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [EmployeeHolidayPolicyComponent, ViweEmployeeHolidayPolicyComponent]
})
export class EmployeeHolidayPolicyMasterModule { }
