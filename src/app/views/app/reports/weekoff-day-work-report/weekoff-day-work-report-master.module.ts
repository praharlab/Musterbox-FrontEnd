import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekoffDayWorkReportMasterRoutingModule } from './weekoff-day-work-report-master-routing.module';
import { WeekoffDayWorkReportComponent } from './weekoff-day-work-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [WeekoffDayWorkReportComponent],
  imports: [
    CommonModule,
    WeekoffDayWorkReportMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule
  ]
})
export class WeekoffDayWorkReportMasterModule { }
