import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyServiceStatusMasterRoutingModule } from './company-service-status-master-routing.module';
import { ListCompanyServiceStatusComponent } from './list-company-service-status/list-company-service-status.component';
import { AddCompanyServiceStatusComponent } from './add-company-service-status/add-company-service-status.component';
import { EditCompanyServiceStatusComponent } from './edit-company-service-status/edit-company-service-status.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListCompanyServiceStatusComponent, AddCompanyServiceStatusComponent, EditCompanyServiceStatusComponent],
  imports: [
    CommonModule,
    CompanyServiceStatusMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class CompanyServiceStatusMasterModule { }
