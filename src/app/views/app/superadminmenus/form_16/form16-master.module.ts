import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form16MasterRoutingModule } from './form16-master-routing.module';
import { ListForm16Component } from './list-form16/list-form16.component';
import { AddForm16Component } from './add-form16/add-form16.component';
import { EditForm16Component } from './edit-form16/edit-form16.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListForm16Component, AddForm16Component, EditForm16Component],
  imports: [
    CommonModule,
    Form16MasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form16MasterModule { }
