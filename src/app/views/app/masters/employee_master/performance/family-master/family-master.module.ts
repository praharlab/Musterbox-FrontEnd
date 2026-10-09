import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FamilyMasterRoutingModule } from './family-master-routing.module';
import { FamilyComponent } from './family/family.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [FamilyComponent],
  imports: [
    CommonModule,
    FamilyMasterRoutingModule,
    ModalModule,
    FormsModule,
    TranslateModule
  ]
})
export class FamilyMasterModule { }
