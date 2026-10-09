import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncrementReportMasterRoutingModule } from './increment-report-master-routing.module';
import { IncrementReportComponent } from './increment-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [IncrementReportComponent],
  imports: [
    CommonModule,
    IncrementReportMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    PagesContainersModule,
    CommonFilterModule
  ]
})
export class IncrementReportMasterModule { }
