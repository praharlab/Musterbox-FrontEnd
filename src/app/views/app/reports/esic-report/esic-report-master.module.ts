import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsicReportMasterRoutingModule } from './esic-report-master-routing.module';
import { EsicReportComponent } from './esic-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [EsicReportComponent],
  imports: [
    CommonModule,
    EsicReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
  ]
})
export class EsicReportMasterModule { }
