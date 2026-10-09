import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDeclarationReportMasterRoutingModule } from './employee-declaration-report-master-routing.module';
import { EmployeeDeclarationReportComponent } from './employee-declaration-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [EmployeeDeclarationReportComponent],
  imports: [
    CommonModule,
    EmployeeDeclarationReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    CommonFilterModule
  ]
})
export class EmployeeDeclarationReportMasterModule { }
