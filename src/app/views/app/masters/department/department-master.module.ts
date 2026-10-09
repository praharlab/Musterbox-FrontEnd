import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentMasterRoutingModule } from './department-master-routing.module';
import { ListDepartmentComponent } from './list-department/list-department.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';
import { ImportDepartmentComponent } from './import-department/import-department.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListDepartmentComponent, AddDepartmentComponent, EditDepartmentComponent, ImportDepartmentComponent],
  imports: [
    CommonModule,
    DepartmentMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule,
    ComponentsStateButtonModule,
  ]
})
export class DepartmentMasterModule { }
