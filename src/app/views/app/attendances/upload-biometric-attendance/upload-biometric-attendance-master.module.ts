import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadBiometricAttendanceMasterRoutingModule } from './upload-biometric-attendance-master-routing.module';
import { UploadBiometricAttendanceComponent } from './upload-biometric-attendance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [UploadBiometricAttendanceComponent],
  imports: [
    CommonModule,
    UploadBiometricAttendanceMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class UploadBiometricAttendanceMasterModule { }
