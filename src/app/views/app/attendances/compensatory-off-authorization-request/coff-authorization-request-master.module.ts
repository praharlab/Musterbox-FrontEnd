import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoffAuthorizationRequestMasterRoutingModule } from './coff-authorization-request-master-routing.module';
import { CompensatoryOffAuthorizationRequestComponent } from './compensatory-off-authorization-request.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AttendanceCommonModule } from '../../attendance-common/attendance-common.module';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [CompensatoryOffAuthorizationRequestComponent],
  imports: [
    CommonModule,
    CoffAuthorizationRequestMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    AttendanceCommonModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class CoffAuthorizationRequestMasterModule { }
