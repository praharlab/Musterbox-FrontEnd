import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseCategoryMasterRoutingModule } from './expense-category-master-routing.module';
import { ListExpenseCategoryComponent } from './list-expense-category/list-expense-category.component';
import { AddExpenseCategoryComponent } from './add-expense-category/add-expense-category.component';
import { EditExpenseCategoryComponent } from './edit-expense-category/edit-expense-category.component';
import { ImportExpenseCategoryComponent } from './import-expense-category/import-expense-category.component';
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
  declarations: [ListExpenseCategoryComponent, AddExpenseCategoryComponent,EditExpenseCategoryComponent, ImportExpenseCategoryComponent],
  imports: [
    CommonModule,
    ExpenseCategoryMasterRoutingModule,
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
export class ExpenseCategoryMasterModule { }
