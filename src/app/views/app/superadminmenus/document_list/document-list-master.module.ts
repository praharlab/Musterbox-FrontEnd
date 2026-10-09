import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentListMasterRoutingModule } from './document-list-master-routing.module';
import { ListDocumentListComponent } from './list-document-list/list-document-list.component';
import { AddDocumentListComponent } from './add-document-list/add-document-list.component';
import { EditDocumentListComponent } from './edit-document-list/edit-document-list.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListDocumentListComponent, AddDocumentListComponent, EditDocumentListComponent],
  imports: [
    CommonModule,
    DocumentListMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class DocumentListMasterModule { }
