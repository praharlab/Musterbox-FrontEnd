import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeJoiningRequestMasterRoutingModule } from './employee-joining-request-master-routing.module';
import { ListJoiningRequestFormComponent } from './list-joining-request-form/list-joining-request-form.component';
import { AddJoiningRequestFormComponent } from './add-joining-request-form/add-joining-request-form.component';
import { EditJoiningRequestFormComponent } from './edit-joining-request-form/edit-joining-request-form.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';


@NgModule({
  declarations: [ListJoiningRequestFormComponent, AddJoiningRequestFormComponent, EditJoiningRequestFormComponent],
  imports: [
    CommonModule,
    EmployeeJoiningRequestMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    NgxSignaturePadModule
  ]
})
export class EmployeeJoiningRequestMasterModule { }
