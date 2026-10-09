import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FnfGenerateExperienceLetterRoutingModule } from './fnf-generate-experience-letter-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FnfGenerateExperienceLetterComponent } from './fnf-generate-experience-letter.component';
@NgModule({
  declarations: [FnfGenerateExperienceLetterComponent],
  imports: [
    CommonModule,
    FnfGenerateExperienceLetterRoutingModule,
    ModalModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
  ],
  exports: [FnfGenerateExperienceLetterComponent]
})
export class FnfGenerateExperienceLetterModule { }
