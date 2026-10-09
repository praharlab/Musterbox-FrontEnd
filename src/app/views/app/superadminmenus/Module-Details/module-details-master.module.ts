import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleDetailsMasterRoutingModule } from './module-details-master-routing.module';
import { ModuleDetailsComponent } from './module-details/module-details.component';
import { AddModuleDetailsComponent } from './add-module-details/add-module-details.component';
import { EditModuleDetailsComponent } from './edit-module-details/edit-module-details.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ModuleDetailsComponent, AddModuleDetailsComponent, EditModuleDetailsComponent],
  imports: [
    CommonModule,
    ModuleDetailsMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class ModuleDetailsMasterModule { }
