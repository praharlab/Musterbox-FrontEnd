import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvanceExpensePaymentMasterRoutingModule } from './advance-expense-payment-master-routing.module';
import { ListAdvanceExpensePaymentComponent } from './list-advance-expense-payment/list-advance-expense-payment.component';
import { AddAdvanceExpensePaymentComponent } from './add-advance-expense-payment/add-advance-expense-payment.component';
import { EditAdvanceExpensePaymentComponent } from './edit-advance-expense-payment/edit-advance-expense-payment.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListAdvanceExpensePaymentComponent, AddAdvanceExpensePaymentComponent, EditAdvanceExpensePaymentComponent],
  imports: [
    CommonModule,
    AdvanceExpensePaymentMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class AdvanceExpensePaymentMasterModule { }
