import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpShortLeavePolicyMasterRoutingModule } from './emp-short-leave-policy-master-routing.module';
import { ListEmpShortLeavePolicyComponent } from './list-emp-short-leave-policy.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListEmpShortLeavePolicyComponent],
  imports: [
    CommonModule,
    EmpShortLeavePolicyMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [ListEmpShortLeavePolicyComponent]
})
export class EmpShortLeavePolicyMasterModule { }
