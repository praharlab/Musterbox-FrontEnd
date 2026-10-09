import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatewiseAttendancePolicyMasterRoutingModule } from './datewise-attendance-policy-master-routing.module';
import { ListDatewiseAttendancePolicyComponent } from './list-datewise-attendance-policy/list-datewise-attendance-policy.component';
import { AddDatewiseAttendancePolicyComponent } from './add-datewise-attendance-policy/add-datewise-attendance-policy.component';
import { EditDatewiseAttendancePolicyComponent } from './edit-datewise-attendance-policy/edit-datewise-attendance-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListDatewiseAttendancePolicyComponent, AddDatewiseAttendancePolicyComponent, EditDatewiseAttendancePolicyComponent],
  imports: [
    CommonModule,
    DatewiseAttendancePolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class DatewiseAttendancePolicyMasterModule { }
