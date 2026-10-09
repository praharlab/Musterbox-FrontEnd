import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeExpenseReportRoutingModule } from './office-expense-report-routing.module';
import { OfficeExpenseReportComponent } from './office-expense-report.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [OfficeExpenseReportComponent],
  imports: [
    CommonModule,
    OfficeExpenseReportRoutingModule,
    PagesContainersModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class OfficeExpenseReportModule { }
