import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceCorrectionMasterRoutingModule } from './attendance-correction-master-routing.module';
import { ListAttendanceCorrectionRequestComponent } from './list-attendance-correction-request/list-attendance-correction-request.component';
import { AddAttendanceCorrectionRequestComponent } from './add-attendance-correction-request/add-attendance-correction-request.component';
import { EditAttendanceCorrectionRequestComponent } from './edit-attendance-correction-request/edit-attendance-correction-request.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListAttendanceCorrectionRequestComponent, AddAttendanceCorrectionRequestComponent, EditAttendanceCorrectionRequestComponent],
  imports: [
    CommonModule,
    AttendanceCorrectionMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    NgSelectModule
  ]
})
export class AttendanceCorrectionMasterModule { }
