import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminOutdoorDutyRoutingModule } from './admin-outdoor-duty-routing.module';
import { AdminOutdoorDutyComponent } from './admin-outdoor-duty.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [AdminOutdoorDutyComponent],
  imports: [
    CommonModule,
    AdminOutdoorDutyRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
  ],
})
export class AdminOutdoorDutyModule {}
