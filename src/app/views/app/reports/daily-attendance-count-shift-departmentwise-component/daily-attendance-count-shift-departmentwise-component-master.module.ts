import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyAttendanceCountShiftDepartmentwiseComponentMasterRoutingModule } from './daily-attendance-count-shift-departmentwise-component-master-routing.module';
import { DailyAttendanceCountShiftDepartmentwiseComponentComponent } from './daily-attendance-count-shift-departmentwise-component.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [DailyAttendanceCountShiftDepartmentwiseComponentComponent],
  imports: [
    CommonModule,
    DailyAttendanceCountShiftDepartmentwiseComponentMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule
  ]
})
export class DailyAttendanceCountShiftDepartmentwiseComponentMasterModule { }
