import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkAttendancePolicyMasterRoutingModule } from './bulk-attendance-policy-master-routing.module';
import { BulkAddAttendancepolicyComponent } from './bulk-add-attendancepolicy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [BulkAddAttendancepolicyComponent],
  imports: [
    CommonModule,
    BulkAttendancePolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BulkAttendancePolicyMasterModule { }
