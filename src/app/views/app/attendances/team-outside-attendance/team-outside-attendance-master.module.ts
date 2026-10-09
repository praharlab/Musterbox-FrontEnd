import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamOutsideAttendanceMasterRoutingModule } from './team-outside-attendance-master-routing.module';
import { TeamOutsideAttendanceComponent } from './team-outside-attendance.component';
import { AddTeamOutsideAttendanceComponent } from './add-team-outside-attendance/add-team-outside-attendance.component';
import { EditTeamOutsideAttendanceComponent } from './edit-team-outside-attendance/edit-team-outside-attendance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [TeamOutsideAttendanceComponent, AddTeamOutsideAttendanceComponent, EditTeamOutsideAttendanceComponent],
  imports: [
    CommonModule,
    TeamOutsideAttendanceMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class TeamOutsideAttendanceMasterModule { }
