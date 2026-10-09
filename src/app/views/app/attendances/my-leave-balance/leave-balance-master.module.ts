import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveBalanceMasterRoutingModule } from './leave-balance-master-routing.module';
import { MyLeaveBalanceComponent } from './my-leave-balance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';


@NgModule({
  declarations: [MyLeaveBalanceComponent],
  imports: [
    CommonModule,
    LeaveBalanceMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
  ]
})
export class LeaveBalanceMasterModule { }
