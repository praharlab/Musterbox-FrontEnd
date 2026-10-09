import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPreboardingCommonComponent } from './view-preboarding-common.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [ViewPreboardingCommonComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ModalModule,
    
  ],
  exports: [ViewPreboardingCommonComponent]
})
export class ViewPreboardingCommonModule { }
