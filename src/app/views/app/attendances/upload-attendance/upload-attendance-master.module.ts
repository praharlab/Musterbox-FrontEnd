import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadAttendanceMasterRoutingModule } from './upload-attendance-master-routing.module';
import { UploadAttendanceComponent } from './upload-attendance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [UploadAttendanceComponent],
  imports: [
    CommonModule,
    UploadAttendanceMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule
  ]
})
export class UploadAttendanceMasterModule { }
