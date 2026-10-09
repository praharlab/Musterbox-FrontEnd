import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalarySlipMasterRoutingModule } from './salary-slip-master-routing.module';
import { SalaryslipComponent } from './salaryslip.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [SalaryslipComponent],
  imports: [
    CommonModule,
    SalarySlipMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    TranslateModule,
    PdfViewerModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class SalarySlipMasterModule { }
