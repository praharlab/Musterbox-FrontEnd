import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveBalanceReportMasterRoutingModule } from './leave-balance-report-master-routing.module';
import { LeaveBalanceReportComponent } from './leave-balance-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [LeaveBalanceReportComponent],
  imports: [
    CommonModule,
    LeaveBalanceReportMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    PdfViewerModule,
    PagesContainersModule,
    CommonFilterModule
  ]
})
export class LeaveBalanceReportMasterModule { }
