import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationMasterRoutingModule } from './designation-master-routing.module';
import { DesignationComponent } from './designation/designation.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [DesignationComponent],
  imports: [
    CommonModule,
    DesignationMasterRoutingModule,
    TranslateModule
  ]
})
export class DesignationMasterModule { }
