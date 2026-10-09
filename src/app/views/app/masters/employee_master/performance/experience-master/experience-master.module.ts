import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExperienceMasterRoutingModule } from './experience-master-routing.module';
import { ExperienceComponent } from './experience/experience.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ExperienceComponent],
  imports: [
    CommonModule,
    ExperienceMasterRoutingModule,
    ModalModule,
    TranslateModule,
    FormsModule
  ]
})
export class ExperienceMasterModule { }
