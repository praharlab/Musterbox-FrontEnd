import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiometricAttendanceSyncMasterRoutingModule } from './biometric-attendance-sync-master-routing.module';
import { BiometricAttendanceSyncComponent } from './biometric-attendance-sync.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BiometricAttendanceSyncComponent],
  imports: [
    CommonModule,
    BiometricAttendanceSyncMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule
  ]
})
export class BiometricAttendanceSyncMasterModule { }
