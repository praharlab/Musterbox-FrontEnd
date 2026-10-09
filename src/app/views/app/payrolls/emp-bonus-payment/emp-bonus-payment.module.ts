import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpBonusPaymentRoutingModule } from './emp-bonus-payment-routing.module';
import { EmpBonusPaymentComponent } from './emp-bonus-payment.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ViewEmpBonusDetailsComponent } from './view-emp-bonus-details/view-emp-bonus-details.component';
import { PaidBonusModule } from '../paid-bonus/paid-bonus.module';
import { PendingBonusModule } from '../pending-bonus/pending-bonus.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [EmpBonusPaymentComponent, ViewEmpBonusDetailsComponent],
  imports: [
    CommonModule,
    EmpBonusPaymentRoutingModule,
    NgxUiLoaderModule,
    CommonFilterModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    PaidBonusModule,
    PendingBonusModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule,
    ModalModule
  ]
})
export class EmpBonusPaymentModule { }
