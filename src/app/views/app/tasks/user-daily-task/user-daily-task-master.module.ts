import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDailyTaskMasterRoutingModule } from './user-daily-task-master-routing.module';
import { UserDailyTaskComponent } from './user-daily-task.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [UserDailyTaskComponent],
  imports: [
    CommonModule,
    UserDailyTaskMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class UserDailyTaskMasterModule { }
