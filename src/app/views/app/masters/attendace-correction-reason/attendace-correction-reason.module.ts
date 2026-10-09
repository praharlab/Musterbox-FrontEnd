import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceCorrectionReasonRoutingModule } from './attendance-correction-reason-routing.module';
import { ListAttendanceCorrectionReasonComponent } from './list-attendance-correction-reason/list-attendance-correction-reason.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { AddAttendanceCorrectionReasonComponent } from './add-attendance-correction-reason/add-attendance-correction-reason.component';
import { EditAttendanceCorrectionReasonComponent } from './edit-attendance-correction-reason/edit-attendance-correction-reason.component';



@NgModule({
  declarations: [ListAttendanceCorrectionReasonComponent, AddAttendanceCorrectionReasonComponent, EditAttendanceCorrectionReasonComponent],
  imports: [
    CommonModule,
    AttendanceCorrectionReasonRoutingModule,
    CommonModule,
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
export class AttendaceCorrectionReasonModule { }
