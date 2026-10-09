import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitPurposeMasterRoutingModule } from './visit-purpose-master-routing.module';
import { ListVisitPurposeComponent } from './list-visit-purpose/list-visit-purpose.component';
import { AddVisitPurposeComponent } from './add-visit-purpose/add-visit-purpose.component';
import { EditVisitPurposeComponent } from './edit-visit-purpose/edit-visit-purpose.component';
import { ImportVisitPurposeComponent } from './import-visit-purpose/import-visit-purpose.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListVisitPurposeComponent, AddVisitPurposeComponent, EditVisitPurposeComponent, ImportVisitPurposeComponent],
  imports: [
    CommonModule,
    VisitPurposeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class VisitPurposeMasterModule { }
