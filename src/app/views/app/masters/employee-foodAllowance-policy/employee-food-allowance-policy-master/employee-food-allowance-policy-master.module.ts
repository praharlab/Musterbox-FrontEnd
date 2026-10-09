import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeFoodAllowancePolicyMasterRoutingModule } from './employee-food-allowance-policy-master-routing.module';
import { EmployeeFoodAllowancePolicyComponent } from '../employee-food-allowance-policy/employee-food-allowance-policy.component';
import { ViewEmployeeFoodAllowancePolicyComponent } from '../view-employee-food-allowance-policy/view-employee-food-allowance-policy.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [EmployeeFoodAllowancePolicyComponent, ViewEmployeeFoodAllowancePolicyComponent],
  imports: [
    CommonModule,
    EmployeeFoodAllowancePolicyMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [EmployeeFoodAllowancePolicyComponent, ViewEmployeeFoodAllowancePolicyComponent]
})
export class EmployeeFoodAllowancePolicyMasterModule { }
