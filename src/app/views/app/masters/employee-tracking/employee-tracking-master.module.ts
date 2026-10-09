import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTrackingMasterRoutingModule } from './employee-tracking-master-routing.module';
import { EmployeeTrackingComponent } from './employee-tracking.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [EmployeeTrackingComponent],
  imports: [
    CommonModule,
    EmployeeTrackingMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    ModalModule,
    ComponentsStateButtonModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class EmployeeTrackingMasterModule { }
