import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkHolidayPolicyMasterRoutingModule } from './bulk-holiday-policy-master-routing.module';
import { BulkAddHolidaypolicyComponent } from './bulk-add-holidaypolicy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [BulkAddHolidaypolicyComponent],
  imports: [
    CommonModule,
    BulkHolidayPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BulkHolidayPolicyMasterModule { }
