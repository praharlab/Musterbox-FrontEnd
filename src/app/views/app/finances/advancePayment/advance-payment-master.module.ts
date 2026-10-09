import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancePaymentMasterRoutingModule } from './advance-payment-master-routing.module';
import { ListAdvancePaymentComponent } from './list-advance-payment/list-advance-payment.component';
import { AddAdvancePaymentComponent } from './add-advance-payment/add-advance-payment.component';
import { EditAdvancePaymentComponent } from './edit-advance-payment/edit-advance-payment.component';
import { ImportAdvancePaymentComponent } from './import-advance-payment/import-advance-payment.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FinanceCommonModule } from '../../finance-common/finance-common.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListAdvancePaymentComponent, AddAdvancePaymentComponent, EditAdvancePaymentComponent, ImportAdvancePaymentComponent],
  imports: [
    CommonModule,
    AdvancePaymentMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    FinanceCommonModule,
    CommonFilterModule
  ]
})
export class AdvancePaymentMasterModule { }
