import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeShiftReportRoutingModule } from './employee-shift-report-routing.module';
import { EmployeeShiftReportComponent } from './employee-shift-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../../common-filter/common-filter.module';


@NgModule({
  declarations: [EmployeeShiftReportComponent],
  imports: [
    CommonModule,
    EmployeeShiftReportRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    CommonFilterModule,
  ]
})
export class EmployeeShiftReportModule { }
