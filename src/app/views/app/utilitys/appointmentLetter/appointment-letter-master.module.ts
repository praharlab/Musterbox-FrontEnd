import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentLetterMasterRoutingModule } from './appointment-letter-master-routing.module';
import { ListAppointmentLetterComponent } from './list-appointment-letter/list-appointment-letter.component';
import { AddAppointmentLetterComponent } from './add-appointment-letter/add-appointment-letter.component';
import { EditAppointmentLetterComponent } from './edit-appointment-letter/edit-appointment-letter.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { QuillModule } from 'ngx-quill';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListAppointmentLetterComponent, AddAppointmentLetterComponent, EditAppointmentLetterComponent],
  imports: [
    CommonModule,
    AppointmentLetterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    QuillModule.forRoot(),
    ModalModule
  ]
})
export class AppointmentLetterMasterModule { }
