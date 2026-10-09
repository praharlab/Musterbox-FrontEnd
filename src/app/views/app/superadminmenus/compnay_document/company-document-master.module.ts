import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDocumentMasterRoutingModule } from './company-document-master-routing.module';
import { ListCompanyDocumentComponent } from './list-company-document/list-company-document.component';
import { AddCompanyDocumentComponent } from './add-company-document/add-company-document.component';
import { EditCompanyDocumentComponent } from './edit-company-document/edit-company-document.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListCompanyDocumentComponent, AddCompanyDocumentComponent, EditCompanyDocumentComponent],
  imports: [
    CommonModule,
    CompanyDocumentMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class CompanyDocumentMasterModule { }
