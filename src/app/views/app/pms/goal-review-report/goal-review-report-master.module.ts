import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoalReviewReportMasterRoutingModule } from './goal-review-report-master-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GoalReviewReportComponent } from './goal-review-report.component';


@NgModule({
  declarations: [GoalReviewReportComponent],
  imports: [
    CommonModule,
    GoalReviewReportMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    PdfViewerModule
  ]
})
export class GoalReviewReportMasterModule { }
