import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeIdcardMasterRoutingModule } from './employee-idcard-master-routing.module';
import { EmployeeIdCardComponent } from './employee-id-card.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [EmployeeIdCardComponent],
  imports: [
    CommonModule,
    EmployeeIdcardMasterRoutingModule,
    NgxUiLoaderModule,
    PdfViewerModule
  ],
  exports: [EmployeeIdCardComponent]
})
export class EmployeeIdcardMasterModule { }
