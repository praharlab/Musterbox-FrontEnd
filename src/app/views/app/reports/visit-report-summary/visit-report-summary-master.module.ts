import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitReportSummaryMasterRoutingModule } from './visit-report-summary-master-routing.module';
import { VisitReportSummaryComponent } from './visit-report-summary.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [VisitReportSummaryComponent],
  imports: [
    CommonModule,
    VisitReportSummaryMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    CommonFilterModule
  ]
})
export class VisitReportSummaryMasterModule { }
