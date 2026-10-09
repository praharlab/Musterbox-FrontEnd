import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeReportstoReportMasterRoutingModule } from './employee-reportsto-report-master-routing.module';
import { EmployeeReportstoReportComponent } from './employee-reportsto-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [EmployeeReportstoReportComponent],
  imports: [
    CommonModule,
    EmployeeReportstoReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class EmployeeReportstoReportMasterModule { }
