import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekoffPolicyMasterRoutingModule } from './weekoff-policy-master-routing.module';
import { ListWeekoffpolicyComponent } from './list-weekoffpolicy/list-weekoffpolicy.component';
import { AddWeekoffpolicyComponent } from './add-weekoffpolicy/add-weekoffpolicy.component';
import { EditWeekoffpolicyComponent } from './edit-weekoffpolicy/edit-weekoffpolicy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ListWeekoffpolicyComponent, AddWeekoffpolicyComponent, EditWeekoffpolicyComponent],
  imports: [
    CommonModule,
    WeekoffPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    RouterModule
  ]
})
export class WeekoffPolicyMasterModule { }
