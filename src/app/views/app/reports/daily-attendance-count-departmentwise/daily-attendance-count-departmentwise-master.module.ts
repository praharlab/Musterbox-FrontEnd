import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyAttendanceCountDepartmentwiseMasterRoutingModule } from './daily-attendance-count-departmentwise-master-routing.module';
import { DailyAttendanceCountDepartmentwiseComponent } from './daily-attendance-count-departmentwise/daily-attendance-count-departmentwise.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [DailyAttendanceCountDepartmentwiseComponent],
  imports: [
    CommonModule,
    DailyAttendanceCountDepartmentwiseMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule
  ]
})
export class DailyAttendanceCountDepartmentwiseMasterModule { }
