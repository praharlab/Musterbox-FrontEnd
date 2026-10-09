import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HolidayPolicyMasterRoutingModule } from './holiday-policy-master-routing.module';
import { ListHolidayPolicyComponent } from './list-holiday-policy/list-holiday-policy.component';
import { AddHolidayPolicyComponent } from './add-holiday-policy/add-holiday-policy.component';
import { EditHolidayPolicyComponent } from './edit-holiday-policy/edit-holiday-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListHolidayPolicyComponent, AddHolidayPolicyComponent, EditHolidayPolicyComponent],
  imports: [
    CommonModule,
    HolidayPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class HolidayPolicyMasterModule { }
