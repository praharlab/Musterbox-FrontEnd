import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyAttendanceEntryRoutingModule } from './monthly-attendance-entry-routing.module';
import { MonthlyAttendanceEntryComponent } from './monthly-attendance-entry.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [MonthlyAttendanceEntryComponent],
  imports: [
    CommonModule,
    MonthlyAttendanceEntryRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    FormsModule,
    CommonFilterModule,
    SimpleNotificationsModule
  ],
  exports: [MonthlyAttendanceEntryComponent]
})
export class MonthlyAttendanceEntryModule { }
