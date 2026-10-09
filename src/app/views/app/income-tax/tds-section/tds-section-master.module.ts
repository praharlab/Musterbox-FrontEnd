import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdsSectionMasterRoutingModule } from './tds-section-master-routing.module';
import { ListTdsSectionComponent } from './list-tds-section/list-tds-section.component';
import { AddTdsSectionComponent } from './add-tds-section/add-tds-section.component';
import { EditTdsSectionComponent } from './edit-tds-section/edit-tds-section.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [ListTdsSectionComponent, AddTdsSectionComponent, EditTdsSectionComponent],
  imports: [
    CommonModule,
    TdsSectionMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule,
    FormsModule,
    TranslateModule,
    QuillModule.forRoot(),
  ]
})
export class TdsSectionMasterModule { }
