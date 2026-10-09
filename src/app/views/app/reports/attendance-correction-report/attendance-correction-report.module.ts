import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceCorrectionReportRoutingModule } from './attendance-correction-report-routing.module';
import { AttendanceCorrectionReportComponent } from './attendance-correction-report.component';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AttendanceCorrectionReportComponent],
  imports: [
    CommonModule,
    AttendanceCorrectionReportRoutingModule,
    CommonFilterModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    FormsModule
  ]
})
export class AttendanceCorrectionReportModule { }
