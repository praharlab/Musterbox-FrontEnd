import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaleAttendanceReportMasterRoutingModule } from './tale-attendance-report-master-routing.module';
import { TaleAttendanceReportComponent } from './tale-attendance-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [TaleAttendanceReportComponent],
  imports: [
    CommonModule,
    TaleAttendanceReportMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class TaleAttendanceReportMasterModule { }
