import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OvertimeConsolidateReportMasterRoutingModule } from './overtime-consolidate-report-master-routing.module';
import { OvertimeConsolidateReportComponent } from './overtime-consolidate-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [OvertimeConsolidateReportComponent],
  imports: [
    CommonModule,
    OvertimeConsolidateReportMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule
  ]
})
export class OvertimeConsolidateReportMasterModule { }
