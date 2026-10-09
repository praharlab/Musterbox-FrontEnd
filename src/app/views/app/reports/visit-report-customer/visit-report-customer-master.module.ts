import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitReportCustomerMasterRoutingModule } from './visit-report-customer-master-routing.module';
import { VisitReportCustomerComponent } from './visit-report-customer.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [VisitReportCustomerComponent],
  imports: [
    CommonModule,
    VisitReportCustomerMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class VisitReportCustomerMasterModule { }
