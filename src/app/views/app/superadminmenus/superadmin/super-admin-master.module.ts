import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminMasterRoutingModule } from './super-admin-master-routing.module';
import { ListSuperadminComponent } from './list-superadmin/list-superadmin.component';
import { AddSuperadminComponent } from './add-superadmin/add-superadmin.component';
import { EditSuperadminComponent } from './edit-superadmin/edit-superadmin.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListSuperadminComponent, AddSuperadminComponent, EditSuperadminComponent],
  imports: [
    CommonModule,
    SuperAdminMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class SuperAdminMasterModule { }
