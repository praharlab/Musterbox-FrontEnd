import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveAuthRequestMasterRoutingModule } from './leave-auth-request-master-routing.module';
import { LeaveAuthrequestComponent } from './leave-authrequest.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AttendanceCommonModule } from '../../attendance-common/attendance-common.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LeaveAuthrequestComponent],
  imports: [
    CommonModule,
    LeaveAuthRequestMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    AttendanceCommonModule,
    FormsModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class LeaveAuthRequestMasterModule { }
