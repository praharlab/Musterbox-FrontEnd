import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryRegisterReportMasterRoutingModule } from './salary-register-report-master-routing.module';
import { SalaryRegisterReportComponent } from './salary-register-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [SalaryRegisterReportComponent],
  imports: [
    CommonModule,
    SalaryRegisterReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    CommonFilterModule
  ]
})
export class SalaryRegisterReportMasterModule { }
