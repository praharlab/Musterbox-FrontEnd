import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseHeadMasterRoutingModule } from './expense-head-master-routing.module';
import { ListExpenseHeadComponent } from './list-expense-head/list-expense-head.component';
import { AddExpenseHeadComponent } from './add-expense-head/add-expense-head.component';
import { EditExpenseHeadComponent } from './edit-expense-head/edit-expense-head.component';
import { ListPriceRuleComponent } from './list-price-rule/list-price-rule.component';
import { ImportExpenseHeadComponent } from './import-expense-head/import-expense-head.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListExpenseHeadComponent, AddExpenseHeadComponent, EditExpenseHeadComponent, ListPriceRuleComponent, ImportExpenseHeadComponent],
  imports: [
    CommonModule,
    ExpenseHeadMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ExpenseHeadMasterModule { }
