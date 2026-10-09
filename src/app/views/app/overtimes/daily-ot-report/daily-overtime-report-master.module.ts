import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyOvertimeReportMasterRoutingModule } from './daily-overtime-report-master-routing.module';
import { DailyOtReportComponent } from './daily-ot-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [DailyOtReportComponent],
  imports: [
    CommonModule,
    DailyOvertimeReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class DailyOvertimeReportMasterModule { }
