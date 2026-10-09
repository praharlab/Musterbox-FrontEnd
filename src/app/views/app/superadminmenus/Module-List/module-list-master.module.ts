import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleListMasterRoutingModule } from './module-list-master-routing.module';
import { ModuleListComponent } from './module-list/module-list.component';
import { AddModuleListComponent } from './add-module-list/add-module-list.component';
import { EditModuleListComponent } from './edit-module-list/edit-module-list.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ModuleListComponent, AddModuleListComponent, EditModuleListComponent],
  imports: [
    CommonModule,
    ModuleListMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class ModuleListMasterModule { }
