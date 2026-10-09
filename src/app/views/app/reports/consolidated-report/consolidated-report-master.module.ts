import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsolidatedReportMasterRoutingModule } from './consolidated-report-master-routing.module';
import { ConsolidatedReportComponent } from './consolidated-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ConsolidatedReportComponent],
  imports: [
    CommonModule,
    ConsolidatedReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PaginationModule,
    CommonFilterModule
  ]
})
export class ConsolidatedReportMasterModule { }
