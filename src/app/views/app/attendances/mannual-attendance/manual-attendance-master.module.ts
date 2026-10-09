import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualAttendanceMasterRoutingModule } from './manual-attendance-master-routing.module';
import { MannualAttendanceComponent } from './mannual-attendance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [MannualAttendanceComponent],
  imports: [
    CommonModule,
    ManualAttendanceMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ManualAttendanceMasterModule { }
