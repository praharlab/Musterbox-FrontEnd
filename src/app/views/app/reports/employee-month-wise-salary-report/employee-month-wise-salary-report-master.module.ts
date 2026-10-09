import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeMonthWiseSalaryReportMasterRoutingModule } from './employee-month-wise-salary-report-master-routing.module';
import { EmployeeMonthWiseSalaryReportComponent } from './employee-month-wise-salary-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [EmployeeMonthWiseSalaryReportComponent],
  imports: [
    CommonModule,
    EmployeeMonthWiseSalaryReportMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class EmployeeMonthWiseSalaryReportMasterModule { }
