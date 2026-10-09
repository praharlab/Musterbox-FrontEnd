import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiveMinuteGapTrackingReportMasterRoutingModule } from './five-minute-gap-tracking-report-master-routing.module';
import { FiveMinuteGapTrackingReportComponent } from './five-minute-gap-tracking-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [FiveMinuteGapTrackingReportComponent],
  imports: [
    CommonModule,
    FiveMinuteGapTrackingReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class FiveMinuteGapTrackingReportMasterModule { }
