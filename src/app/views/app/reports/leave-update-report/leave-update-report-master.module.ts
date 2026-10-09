import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveUpdateReportMasterRoutingModule } from './leave-update-report-master-routing.module';
import { LeaveUpdateReportComponent } from './leave-update-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [LeaveUpdateReportComponent],
  imports: [
    CommonModule,
    LeaveUpdateReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class LeaveUpdateReportMasterModule { }
