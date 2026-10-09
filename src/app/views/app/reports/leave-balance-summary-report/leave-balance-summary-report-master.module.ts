import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveBalanceSummaryReportMasterRoutingModule } from './leave-balance-summary-report-master-routing.module';
import { LeaveBalanceSummaryReportComponent } from './leave-balance-summary-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [LeaveBalanceSummaryReportComponent],
  imports: [
    CommonModule,
    LeaveBalanceSummaryReportMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class LeaveBalanceSummaryReportMasterModule { }
