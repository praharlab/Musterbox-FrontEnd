import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeWeekoffPolicyMasterRoutingModule } from './employee-weekoff-policy-master-routing.module';
import { EmployeeWeekoffPolicyComponent } from './employee-weekoff-policy/employee-weekoff-policy.component';
import { ViewEmployeeWeekoffPolicyComponent } from './view-employee-weekoff-policy/view-employee-weekoff-policy.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [EmployeeWeekoffPolicyComponent, ViewEmployeeWeekoffPolicyComponent],
  imports: [
    CommonModule,
    EmployeeWeekoffPolicyMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [EmployeeWeekoffPolicyComponent, ViewEmployeeWeekoffPolicyComponent]
})
export class EmployeeWeekoffPolicyMasterModule { }
