import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoiningDocTypeMasterRoutingModule } from './joining-doc-type-master-routing.module';
import { ListJoiningDocumentTypeComponent } from './list-joining-document-type/list-joining-document-type.component';
import { AddJoiningDocumentTypeComponent } from './add-joining-document-type/add-joining-document-type.component';
import { EditJoiningDocumentTypeComponent } from './edit-joining-document-type/edit-joining-document-type.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListJoiningDocumentTypeComponent, AddJoiningDocumentTypeComponent, EditJoiningDocumentTypeComponent],
  imports: [
    CommonModule,
    JoiningDocTypeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule,
  ]
})
export class JoiningDocTypeMasterModule { }
