import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EducationMasterRoutingModule } from './education-master-routing.module';
import { EducationComponent } from './education/education.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [EducationComponent],
  imports: [
    CommonModule,
    EducationMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule
  ]
})
export class EducationMasterModule { }
