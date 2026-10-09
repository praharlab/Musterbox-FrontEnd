import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceReport4MasterRoutingModule } from './attendance-report4-master-routing.module';
import { AttendanceReport4Component } from './attendance-report4.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [AttendanceReport4Component],
  imports: [
    CommonModule,
    AttendanceReport4MasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    CommonFilterModule
  ]
})
export class AttendanceReport4MasterModule { }
