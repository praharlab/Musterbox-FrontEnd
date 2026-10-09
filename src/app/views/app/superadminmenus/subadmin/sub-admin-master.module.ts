import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubAdminMasterRoutingModule } from './sub-admin-master-routing.module';
import { ListSubadminComponent } from './list-subadmin/list-subadmin.component';
import { AddSubadminComponent } from './add-subadmin/add-subadmin.component';
import { EditSubadminComponent } from './edit-subadmin/edit-subadmin.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListSubadminComponent, AddSubadminComponent, EditSubadminComponent],
  imports: [
    CommonModule,
    SubAdminMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class SubAdminMasterModule { }
