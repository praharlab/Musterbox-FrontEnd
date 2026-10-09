import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendancePolicyMasterRoutingModule } from './attendance-policy-master-routing.module';
import { ListAttendancepolicyComponent } from './list-attendancepolicy/list-attendancepolicy.component';
import { AddAttendancepolicyComponent } from './add-attendancepolicy/add-attendancepolicy.component';
import { EditAttendancepolicyComponent } from './edit-attendancepolicy/edit-attendancepolicy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListAttendancepolicyComponent, AddAttendancepolicyComponent, EditAttendancepolicyComponent],
  imports: [
    CommonModule,
    AttendancePolicyMasterRoutingModule,
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
export class AttendancePolicyMasterModule { }
