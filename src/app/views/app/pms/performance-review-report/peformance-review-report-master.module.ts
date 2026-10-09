import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeformanceReviewReportMasterRoutingModule } from './peformance-review-report-master-routing.module';
import { PerformanceReviewReportComponent } from './performance-review-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [PerformanceReviewReportComponent],
  imports: [
    CommonModule,
    PeformanceReviewReportMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    PdfViewerModule
  ]
})
export class PeformanceReviewReportMasterModule { }
