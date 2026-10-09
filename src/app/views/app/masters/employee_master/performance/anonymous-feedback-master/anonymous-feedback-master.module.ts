import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnonymousFeedbackMasterRoutingModule } from './anonymous-feedback-master-routing.module';
import { AnonymousFeedbackComponent } from './anonymous-feedback/anonymous-feedback.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AnonymousFeedbackComponent],
  imports: [
    CommonModule,
    AnonymousFeedbackMasterRoutingModule,
    FormsModule,
    TranslateModule
  ]
})
export class AnonymousFeedbackMasterModule { }
