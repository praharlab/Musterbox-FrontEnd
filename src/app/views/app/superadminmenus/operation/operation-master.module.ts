import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationMasterRoutingModule } from './operation-master-routing.module';
import { ListOperationComponent } from './list-operation/list-operation.component';
import { AddOperationComponent } from './add-operation/add-operation.component';
import { EditOperationComponent } from './edit-operation/edit-operation.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListOperationComponent, AddOperationComponent, EditOperationComponent],
  imports: [
    CommonModule,
    OperationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class OperationMasterModule { }
