import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyAttendanceReportNewMasterRoutingModule } from './daily-attendance-report-new-master-routing.module';
import { DailyattendancereportNewComponent } from './dailyattendancereport-new.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [DailyattendancereportNewComponent],
  imports: [
    CommonModule,
    DailyAttendanceReportNewMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PaginationModule,
    CommonFilterModule
  ]
})
export class DailyAttendanceReportNewMasterModule { }
