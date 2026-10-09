import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyTypeMasterRoutingModule } from './company-type-master-routing.module';
import { ListCompanyTypeComponent } from './list-company-type/list-company-type.component';
import { AddCompanyTypeComponent } from './add-company-type/add-company-type.component';
import { EditCompanyTypeComponent } from './edit-company-type/edit-company-type.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListCompanyTypeComponent, AddCompanyTypeComponent, EditCompanyTypeComponent],
  imports: [
    CommonModule,
    CompanyTypeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class CompanyTypeMasterModule { }
