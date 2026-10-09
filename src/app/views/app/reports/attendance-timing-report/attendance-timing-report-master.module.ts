import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceTimingReportMasterRoutingModule } from './attendance-timing-report-master-routing.module';
import { AttendanceTimingReportComponent } from './attendance-timing-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [AttendanceTimingReportComponent],
  imports: [
    CommonModule,
    AttendanceTimingReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class AttendanceTimingReportMasterModule { }
