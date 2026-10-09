import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyAttendanceReportMasterRoutingModule } from './daily-attendance-report-master-routing.module';
import { DailyattendancereportComponent } from './dailyattendancereport.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [DailyattendancereportComponent],
  imports: [
    CommonModule,
    DailyAttendanceReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PaginationModule,
    CommonFilterModule
  ]
})
export class DailyAttendanceReportMasterModule { }
