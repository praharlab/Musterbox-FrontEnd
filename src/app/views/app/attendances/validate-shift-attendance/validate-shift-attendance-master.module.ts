import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidateShiftAttendanceMasterRoutingModule } from './validate-shift-attendance-master-routing.module';
import { ValidateShiftAttendanceComponent } from './validate-shift-attendance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ValidateShiftAttendanceComponent],
  imports: [
    CommonModule,
    ValidateShiftAttendanceMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class ValidateShiftAttendanceMasterModule { }
