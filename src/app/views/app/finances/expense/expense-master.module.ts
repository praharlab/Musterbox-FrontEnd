import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseMasterRoutingModule } from './expense-master-routing.module';
import { ListExpenseComponent } from './list-expense/list-expense.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ViewFinanceTransCommonModule } from '../view-finance-trans-common/view-finance-trans-common.module';
import { ViewExpenseCommonModule } from '../view-expense-common/view-expense-common.module';


@NgModule({
  declarations: [ListExpenseComponent, AddExpenseComponent, EditExpenseComponent],
  imports: [
    CommonModule,
    ExpenseMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ViewFinanceTransCommonModule,
    ViewExpenseCommonModule
  ]
})
export class ExpenseMasterModule { }
