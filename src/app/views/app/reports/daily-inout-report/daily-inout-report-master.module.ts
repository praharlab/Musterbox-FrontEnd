import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyInoutReportMasterRoutingModule } from './daily-inout-report-master-routing.module';
import { DailyInoutReportComponent } from './daily-inout-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [DailyInoutReportComponent],
  imports: [
    CommonModule,
    DailyInoutReportMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    CommonFilterModule
  ]
})
export class DailyInoutReportMasterModule { }
