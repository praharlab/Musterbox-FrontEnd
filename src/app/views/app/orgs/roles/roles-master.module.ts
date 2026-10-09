import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesMasterRoutingModule } from './roles-master-routing.module';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { CloneRolesComponent } from './clone-roles/clone-roles.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PermissionViewModule } from '../permission-view/permission-view.module';


@NgModule({
  declarations: [ListRolesComponent, AddRolesComponent, EditRolesComponent, CloneRolesComponent],
  imports: [
    CommonModule,
    RolesMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    PermissionViewModule
  ]
})
export class RolesMasterModule { }
