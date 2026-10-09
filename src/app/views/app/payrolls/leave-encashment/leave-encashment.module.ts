import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveEncashmentRoutingModule } from './leave-encashment-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ListLeaveEncashmentComponent } from '../list-leave-encashment/list-leave-encashment.component';



@NgModule({
  declarations: [ListLeaveEncashmentComponent],
  imports: [
    CommonModule,
    LeaveEncashmentRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    CommonFilterModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class LeaveEncashmentModule { }
