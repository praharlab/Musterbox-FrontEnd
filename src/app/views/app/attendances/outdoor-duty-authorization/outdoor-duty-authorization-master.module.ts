import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutdoorDutyAuthorizationMasterRoutingModule } from './outdoor-duty-authorization-master-routing.module';
import { OutdoorDutyAuthorizationComponent } from './outdoor-duty-authorization.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OutdoorDutyAcceptRejectModalComponent } from './outdoor-duty-accept-reject-modal/outdoor-duty-accept-reject-modal.component';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [OutdoorDutyAuthorizationComponent, OutdoorDutyAcceptRejectModalComponent],
  imports: [
    CommonModule,
    OutdoorDutyAuthorizationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class OutdoorDutyAuthorizationMasterModule { }
