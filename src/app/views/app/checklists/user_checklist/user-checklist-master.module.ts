import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserChecklistMasterRoutingModule } from './user-checklist-master-routing.module';
import { ListUserChecklistComponent } from './list-user-checklist/list-user-checklist.component';
import { AddUserChecklistComponent } from './add-user-checklist/add-user-checklist.component';
import { EditUserChecklistComponent } from './edit-user-checklist/edit-user-checklist.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListUserChecklistComponent, AddUserChecklistComponent, EditUserChecklistComponent],
  imports: [
    CommonModule,
    UserChecklistMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    NgSelectModule
  ]
})
export class UserChecklistMasterModule { }
