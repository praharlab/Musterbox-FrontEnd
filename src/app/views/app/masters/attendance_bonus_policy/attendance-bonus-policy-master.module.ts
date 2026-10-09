import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceBonusPolicyMasterRoutingModule } from './attendance-bonus-policy-master-routing.module';
import { ListAttendanceBonusPolicyComponent } from './list-attendance-bonus-policy/list-attendance-bonus-policy.component';
import { AddAttendanceBonusPolicyComponent } from './add-attendance-bonus-policy/add-attendance-bonus-policy.component';
import { EditAttendanceBonusPolicyComponent } from './edit-attendance-bonus-policy/edit-attendance-bonus-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListAttendanceBonusPolicyComponent, AddAttendanceBonusPolicyComponent, EditAttendanceBonusPolicyComponent],
  imports: [
    CommonModule,
    AttendanceBonusPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    ModalModule
  ]
})
export class AttendanceBonusPolicyMasterModule { }
