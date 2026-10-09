import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdsSubSectionMasterRoutingModule } from './tds-sub-section-master-routing.module';
import { ListTdsSubsectionComponent } from './list-tds-subsection/list-tds-subsection.component';
import { AddTdsSubsectionComponent } from './add-tds-subsection/add-tds-subsection.component';
import { EditTdsSubsectionComponent } from './edit-tds-subsection/edit-tds-subsection.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [ListTdsSubsectionComponent, AddTdsSubsectionComponent, EditTdsSubsectionComponent],
  imports: [
    CommonModule,
    TdsSubSectionMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule,
    QuillModule.forRoot()
  ]
})
export class TdsSubSectionMasterModule { }
