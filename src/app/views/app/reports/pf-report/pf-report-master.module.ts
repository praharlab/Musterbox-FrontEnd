import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfReportMasterRoutingModule } from './pf-report-master-routing.module';
import { PfReportComponent } from './pf-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [PfReportComponent],
  imports: [
    CommonModule,
    PfReportMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PdfViewerModule
  ]
})
export class PfReportMasterModule { }
