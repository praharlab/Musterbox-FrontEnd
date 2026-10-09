import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyReportMasterRoutingModule } from './company-report-master-routing.module';
import { ListCompanyReportComponent } from './list-company-report/list-company-report.component';
import { AddCompanyReportComponent } from './add-company-report/add-company-report.component';
import { EditCompanyReportComponent } from './edit-company-report/edit-company-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListCompanyReportComponent, AddCompanyReportComponent, EditCompanyReportComponent],
  imports: [
    CommonModule,
    CompanyReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class CompanyReportMasterModule { }
