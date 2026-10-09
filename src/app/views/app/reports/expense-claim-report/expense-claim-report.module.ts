import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseClaimReportRoutingModule } from './expense-claim-report-routing.module';
import { ExpenseClaimReportComponent } from './expense-claim-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';

@NgModule({
  declarations: [ExpenseClaimReportComponent],
  imports: [
    CommonModule,
    ExpenseClaimReportRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule,
  ],
})
export class ExpenseClaimReportModule {}
