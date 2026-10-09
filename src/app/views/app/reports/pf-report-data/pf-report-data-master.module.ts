import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfReportDataMasterRoutingModule } from './pf-report-data-master-routing.module';
import { PFReportDataComponent } from './pf-report-data.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [PFReportDataComponent],
  imports: [
    CommonModule,
    PfReportDataMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
  ]
})
export class PfReportDataMasterModule { }
