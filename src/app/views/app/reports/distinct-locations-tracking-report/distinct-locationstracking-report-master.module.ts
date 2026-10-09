import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistinctLocationstrackingReportMasterRoutingModule } from './distinct-locationstracking-report-master-routing.module';
import { DistinctLocationsTrackingReportComponent } from './distinct-locations-tracking-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [DistinctLocationsTrackingReportComponent],
  imports: [
    CommonModule,
    DistinctLocationstrackingReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class DistinctLocationstrackingReportMasterModule { }
