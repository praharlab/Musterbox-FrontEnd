import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpAttendanceCalendarMasterRoutingModule } from './emp-attendance-calendar-master-routing.module';
import { EmployeeAttendanceCalendarComponent } from './employee-attendance-calendar.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ManualLeaveMasterModule } from '../addmanual-leave/manual-leave-master.module';


@NgModule({
  declarations: [EmployeeAttendanceCalendarComponent],
  imports: [
    CommonModule,
    EmpAttendanceCalendarMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    DashboardsContainersModule,
    ModalModule,
    ManualLeaveMasterModule
  ]
})
export class EmpAttendanceCalendarMasterModule { }
