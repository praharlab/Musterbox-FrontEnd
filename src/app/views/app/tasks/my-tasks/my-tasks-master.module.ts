import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTasksMasterRoutingModule } from './my-tasks-master-routing.module';
import { MyTasksComponent } from './my-tasks.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [MyTasksComponent],
  imports: [
    CommonModule,
    MyTasksMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    RoundProgressModule,
    ModalModule,
    TabsModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class MyTasksMasterModule { }
