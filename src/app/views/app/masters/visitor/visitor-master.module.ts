import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorMasterRoutingModule } from './visitor-master-routing.module';
import { ListVisitorComponent } from './list-visitor/list-visitor.component';
import { AddVisitorComponent } from './add-visitor/add-visitor.component';
import { EditVisitorComponent } from './edit-visitor/edit-visitor.component';
import { ImportVisitorComponent } from './import-visitor/import-visitor.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListVisitorComponent, AddVisitorComponent, EditVisitorComponent, ImportVisitorComponent],
  imports: [
    CommonModule,
    VisitorMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class VisitorMasterModule { }
