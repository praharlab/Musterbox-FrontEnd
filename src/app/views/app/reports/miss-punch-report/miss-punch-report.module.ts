import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissPunchReportRoutingModule } from './miss-punch-report-routing.module';
import { MissPunchReportComponent } from './miss-punch-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [MissPunchReportComponent],
  imports: [
    CommonModule,
    MissPunchReportRoutingModule,
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
export class MissPunchReportModule { }