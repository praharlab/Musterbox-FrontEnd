import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserResignationMasterRoutingModule } from './user-resignation-master-routing.module';
import { UserResignationComponent } from './user-resignation.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [UserResignationComponent],
  imports: [
    CommonModule,
    UserResignationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    QuillModule.forRoot(),
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class UserResignationMasterModule { }
