import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OvertimeReportUserwiseMasterRoutingModule } from './overtime-report-userwise-master-routing.module';
import { OvertimeReportUserwiseComponent } from './overtime-report-userwise.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [OvertimeReportUserwiseComponent],
  imports: [
    CommonModule,
    OvertimeReportUserwiseMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    SimpleNotificationsModule.forRoot(),
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class OvertimeReportUserwiseMasterModule { }
