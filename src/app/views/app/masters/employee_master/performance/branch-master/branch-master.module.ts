import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchMasterRoutingModule } from './branch-master-routing.module';
import { BranchComponent } from './branch/branch.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BranchComponent],
  imports: [
    CommonModule,
    BranchMasterRoutingModule,
    TranslateModule
  ]
})
export class BranchMasterModule { }
