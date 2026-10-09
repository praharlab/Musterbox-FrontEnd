import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalarySummaryRoutingModule } from './salary-summary-routing.module';
import { SalarySummaryComponent } from './salary-summary.component';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';


@NgModule({
  declarations: [SalarySummaryComponent],
  imports: [
    CommonModule,
    SalarySummaryRoutingModule,
    CommonFilterModule,
    FormsModule,
    NgxDatatableModule,
    PaginationModule,
    NgxUiLoaderModule,
    PagesContainersModule
  ],
  exports: [SalarySummaryComponent]
})
export class SalarySummaryModule { }
