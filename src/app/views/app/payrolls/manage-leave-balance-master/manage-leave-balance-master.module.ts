import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageLeaveBalanceMasterRoutingModule } from './manage-leave-balance-master-routing.module';
import { ListManageLeaveBalanceComponent } from './list-manage-leave-balance/list-manage-leave-balance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ManageLeaveBalanceComponent } from './manage-leave-balance/manage-leave-balance.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ViewLeaveBalanceComponent } from './view-leave-balance/view-leave-balance.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ListUserDataMasterModule } from '../../masters/employee_master/list-user-data/list-user-data-master.module';
import { ListAddLeaveBalanceMasterModule } from '../list-add-leave-balance-master/list-add-leave-balance-master.module';
import { ListLeaveEncashmentMasterModule } from '../list-leave-encashment-master/list-leave-encashment-master.module';
import { ApprovedLeaveTransactionMasterModule } from '../approved-leave-transaction-master/approved-leave-transaction-master.module';
import { LapseLeaveMasterModule } from '../lapse-leave-master/lapse-leave-master.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [ListManageLeaveBalanceComponent, ManageLeaveBalanceComponent, ViewLeaveBalanceComponent],
  imports: [
    CommonModule,
    ManageLeaveBalanceMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    CommonFilterModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    LayoutContainersModule,
    ListUserDataMasterModule,
    ListAddLeaveBalanceMasterModule,
    ListLeaveEncashmentMasterModule,
    ApprovedLeaveTransactionMasterModule,
    LapseLeaveMasterModule
  ]
})
export class ManageLeaveBalanceMasterModule { }
