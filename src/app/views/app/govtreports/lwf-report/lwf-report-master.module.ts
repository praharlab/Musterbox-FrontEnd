import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LwfReportMasterRoutingModule } from './lwf-report-master-routing.module';
import { LwfReportComponent } from './lwf-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [LwfReportComponent],
  imports: [
    CommonModule,
    LwfReportMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PdfViewerModule
  ]
})
export class LwfReportMasterModule { }
