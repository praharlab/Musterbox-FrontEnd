import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceCalMasterRoutingModule } from './attendance-cal-master-routing.module';
import { ListattendanceCalComponent } from './listattendance-cal/listattendance-cal.component';
import { AddattendanceCalComponent } from './addattendance-cal/addattendance-cal.component';
import { EditattendanceCalComponent } from './editattendance-cal/editattendance-cal.component';
import { AttendanceVerifiedComponent } from './attendance-verified/attendance-verified.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewFNFCountModule } from '../view-fnf-count/view-fnf-count.module';


@NgModule({
  declarations: [ListattendanceCalComponent, AddattendanceCalComponent, EditattendanceCalComponent, AttendanceVerifiedComponent],
  imports: [
    CommonModule,
    AttendanceCalMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    LayoutContainersModule,
    PaginationModule,
    ModalModule,
    PdfViewerModule,
    ViewFNFCountModule
  ]
})
export class AttendanceCalMasterModule { }
