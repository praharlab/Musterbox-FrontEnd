import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskMasterRoutingModule } from './task-master-routing.module';
import { ListTaskComponent } from './list-task/list-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { QuillModule } from 'ngx-quill';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListTaskComponent, AddTaskComponent, EditTaskComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    TabsModule,
    NgxMaterialTimepickerModule,
    QuillModule.forRoot(),
    CommonFilterModule
  ]
})
export class TaskMasterModule { }
