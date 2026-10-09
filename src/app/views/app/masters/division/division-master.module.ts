import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivisionMasterRoutingModule } from './division-master-routing.module';
import { ListDivisionComponent } from './list-division/list-division.component';
import { AddDivisionComponent } from './add-division/add-division.component';
import { EditDivisionComponent } from './edit-division/edit-division.component';
import { ImportDivisionComponent } from './import-division/import-division.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListDivisionComponent, AddDivisionComponent, EditDivisionComponent, ImportDivisionComponent],
  imports: [
    CommonModule,
    DivisionMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class DivisionMasterModule { }
