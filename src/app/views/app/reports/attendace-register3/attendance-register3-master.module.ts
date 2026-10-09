import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRegister3MasterRoutingModule } from './attendance-register3-master-routing.module';
import { AttendaceRegister3Component } from './attendace-register3.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [AttendaceRegister3Component],
  imports: [
    CommonModule,
    AttendanceRegister3MasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    CommonFilterModule
  ]
})
export class AttendanceRegister3MasterModule { }
